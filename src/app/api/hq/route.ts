/**
 * HQ («Штаб») — вебхук асистента групи компаній.
 * Система над усіма бізнесами власників, а не всередині одного з них:
 * LEGAR тут — лише одна з компаній у hq_projects.
 *
 * Приватний чат: будь-який текст → чернетка задачі.
 * Груповий чат:  тільки «/task ...» або повідомлення з «+» на початку,
 *                щоб бот не перетворював обговорення на задачі.
 */

import { NextResponse, type NextRequest } from "next/server";
import { parseTask } from "@/lib/hq/parse";
import {
  HELP, companyOf, draftCard, draftKb, taskCard, taskKb, taskList, taskListByCompany, type Ctx,
} from "@/lib/hq/render";
import {
  addAttachment, addPerson, addProject, createTask, db, doneSince, dropReminders,
  getSettings, getTask, people, projects, replaceLadder, setAliases,
  setPending, tasksOf, updateTask, wipCount,
} from "@/lib/hq/store";
import { answer, edit, esc, kb, send, sendAttachment } from "@/lib/hq/tg";
import { human, localDay } from "@/lib/hq/time";
import type { Attachment, Person, Project, Task } from "@/lib/hq/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SECRET = process.env.TELEGRAM_HQ_WEBHOOK_SECRET;
const BOOTSTRAP = process.env.HQ_BOOTSTRAP_CODE;

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Контекст запиту: налаштування + довідники людей і проєктів. */
type Full = Ctx & { list: Person[]; projList: Project[] };

async function context(): Promise<Full> {
  const sb = db();
  const [s, list, projList] = await Promise.all([getSettings(sb), people(sb), projects(sb)]);
  return {
    s,
    people: new Map(list.map((p) => [p.id, p])),
    projects: new Map(projList.map((p) => [p.id, p])),
    now: new Date(),
    list,
    projList,
  };
}

/** Показує картку задачі тому, кого вона стосується. */
async function push(task: Task, to: Person, c: Ctx, prefix = "") {
  await send(to.tg_id, (prefix ? `${prefix}\n\n` : "") + taskCard(task, c), taskKb(task, to));
}

// ── Дії над задачею ───────────────────────────────────────────────────────
async function onAction(task: Task, action: string, arg: string | undefined, actor: Person, c: Ctx) {
  const sb = db();
  const assignee = c.people.get(task.assignee_id)!;
  const creator = c.people.get(task.creator_id)!;

  switch (action) {
    case "take": {
      const t = await updateTask(task.id, { status: "doing" }, sb);
      if (creator.id !== actor.id) await send(creator.tg_id, `▶️ ${esc(actor.name)} взял(а) в работу <b>#${t.id}</b> — ${esc(t.title)}`);
      return t;
    }

    case "submit": {
      // Просимо результат: без нього «готово» нічого не означає.
      await setPending(actor.id, { kind: "result", task_id: task.id }, sb);
      await send(actor.tg_id,
        `Пришлите результат по <b>#${task.id}</b> — текст, ссылку или файл.`,
        kb([[["Без комментария", `t:${task.id}:submit0`]]]));
      return task;
    }

    case "submit0":
    case "submitDone": {
      await setPending(actor.id, null, sb);
      const t = await updateTask(task.id, { status: "submitted", submitted_at: new Date().toISOString() }, sb);
      await dropReminders(t.id, sb);
      if (creator.id === actor.id) return finish(t, actor, c);      // сам поставив — сам закрив
      await send(creator.tg_id,
        `📤 <b>${esc(actor.name)}</b> сдал(а) работу:\n\n${taskCard(t, c)}`,
        taskKb(t, creator));
      for (const a of t.attachments.filter((x) => x.caption === "result")) await sendAttachment(creator.tg_id, a);
      await send(actor.tg_id, `Отправил ${esc(creator.name)} на приёмку ✅`);
      return t;
    }

    case "accept":
      return finish(task, actor, c);

    case "reject": {
      const t = await updateTask(task.id, { status: "doing", submitted_at: null }, sb);
      await send(assignee.tg_id, `↩️ ${esc(actor.name)} вернул(а) задачу на доработку:\n\n${taskCard(t, c)}`, taskKb(t, assignee));
      return t;
    }

    case "snooze": {
      const mins = Number(arg ?? 60);
      const base = task.due_at ? new Date(task.due_at) : new Date();
      const from = base.getTime() < Date.now() ? new Date() : base;
      const due = new Date(from.getTime() + mins * 60000);
      const t = await updateTask(task.id, { due_at: due.toISOString(), snoozes: task.snoozes + 1 }, sb);
      await replaceLadder(t, c.s, sb);
      if (creator.id !== actor.id) {
        await send(creator.tg_id,
          `↻ ${esc(actor.name)} перенёс(ла) <b>#${t.id}</b> «${esc(t.title)}» на ${human(due, c.s.tz, c.now)}` +
          (t.snoozes >= 3 ? `\n\n⚠️ Это уже ${t.snoozes}-й перенос — возможно, задача нереальна по срокам или её пора отдать другому.` : ""));
      }
      return t;
    }

    case "risk": {
      await send(creator.tg_id,
        `🚫 <b>${esc(actor.name)}</b> сообщает, что не успевает:\n\n${taskCard(task, c)}\n\nПеренести срок или переназначить?`,
        kb([[["+1 день", `t:${task.id}:snooze:1440`], ["Снять", `t:${task.id}:cancel`]]]));
      await send(actor.tg_id, `Передал ${esc(creator.name)} ✅`);
      return task;
    }

    case "ping": {
      await send(creator.tg_id, `🔔 Задача ждёт вашей приёмки:\n\n${taskCard(task, c)}`, taskKb(task, creator));
      return task;
    }

    case "cancel": {
      const t = await updateTask(task.id, { status: "cancelled" }, sb);
      await dropReminders(t.id, sb);
      const other = actor.id === creator.id ? assignee : creator;
      if (other.id !== actor.id) await send(other.tg_id, `✖️ ${esc(actor.name)} снял(а) задачу <b>#${t.id}</b> — ${esc(t.title)}`);
      return t;
    }

    default:
      return task;
  }
}

async function finish(task: Task, actor: Person, c: Ctx) {
  const sb = db();
  const t = await updateTask(task.id, { status: "done", done_at: new Date().toISOString() }, sb);
  await dropReminders(t.id, sb);
  const assignee = c.people.get(t.assignee_id)!;
  const inTime = t.due_at ? new Date(t.done_at!) <= new Date(t.due_at) : true;
  if (assignee.id !== actor.id) {
    await send(assignee.tg_id, `👍 ${esc(actor.name)} принял(а) работу по <b>#${t.id}</b> — ${esc(t.title)}. Закрыто.`);
  }
  await send(actor.tg_id, `✅ <b>#${t.id}</b> ${esc(t.title)} — закрыто${inTime ? " в срок" : " с опозданием"}.`);
  return t;
}

// ── Постановка задачі ─────────────────────────────────────────────────────
async function makeDraft(raw: string, author: Person, chatId: number, c: Full, attach?: Attachment) {
  const p = parseTask(raw, { people: c.list, projects: c.projList, author, tz: c.s.tz, now: c.now });
  const notes = [...p.notes];
  const assignee = p.assignee ?? author;
  if (!p.assignee) notes.push("исполнитель не распознан — поставил на вас");
  if (p.due_at && p.due_at.getTime() < (c.now ?? new Date()).getTime()) {
    notes.push("срок уже прошёл — проверьте кнопкой «Срок»");
  }

  const draft = await createTask({
    kind: p.kind,
    title: p.title.slice(0, 300),
    creator_id: author.id,
    assignee_id: assignee.id,
    project_id: p.project?.id ?? null,
    due_at: p.due_at?.toISOString() ?? null,
    status: "draft",
    source_chat_id: chatId,
    attachments: attach ? [attach] : [],
  });

  await send(chatId, draftCard(draft, c, notes), draftKb(draft.id));
  return draft;
}

/** Підтвердження чернетки: перевіряємо дедлайн і завантаження виконавця. */
async function confirmDraft(task: Task, actor: Person, c: Ctx, force = false) {
  const sb = db();
  if (!task.due_at) {
    await setPending(actor.id, { kind: "due", task_id: task.id }, sb);
    await send(actor.tg_id,
      "Без срока задачи теряются — я такие не беру.\n\nКогда дедлайн? Напишите, например: <code>сегодня в 20:00</code>, <code>завтра к обеду</code>, <code>в пятницу</code>.");
    return;
  }

  const assignee = c.people.get(task.assignee_id)!;
  if (!force && assignee.id !== actor.id) {
    const wip = await wipCount(assignee.id, sb);
    if (wip >= c.s.wip_limit) {
      const load = await tasksOf(assignee.id, "assignee", sb);
      await send(actor.tg_id,
        `⚠️ У ${esc(assignee.name)} уже ${wip} активных задач:\n\n` +
        taskList("", load.slice(0, 5), c) +
        `\n\nСтавим ещё одну или сначала что-то подвинем?`,
        kb([[["Всё равно поставить", `d:${task.id}:force`]], [["✖️ Отмена", `d:${task.id}:x`]]]));
      return;
    }
  }

  const t = await updateTask(task.id, { status: "open" }, sb);
  await replaceLadder(t, c.s, sb);
  await send(actor.tg_id, `Поставлено ✅\n\n${taskCard(t, c)}`, taskKb(t, actor));
  if (assignee.id !== actor.id) {
    await push(t, assignee, c, `📌 <b>${esc(actor.name)}</b> поставил(а) вам задачу`);
    for (const a of t.attachments) await sendAttachment(assignee.tg_id, a);
  }
}

// ── Команди ───────────────────────────────────────────────────────────────
async function onCommand(cmd: string, rest: string, person: Person, chatId: number, c: Full): Promise<boolean> {
  const sb = db();
  switch (cmd) {
    case "/start":
    case "/help":
      await send(chatId, HELP);
      return true;

    case "/me":
      await send(chatId, `Вы: <b>${esc(person.name)}</b>\nTelegram ID: <code>${person.tg_id}</code>\nЧат: <code>${chatId}</code>${person.is_admin ? "\nПрава: админ" : ""}`);
      return true;

    case "/my": {
      const list = await tasksOf(person.id, "assignee", sb);
      await send(chatId, taskList("<b>Ваши задачи</b>", list, c));
      return true;
    }

    case "/all": {
      const all = (await Promise.all(c.list.map((p) => tasksOf(p.id, "assignee", sb)))).flat();
      await send(chatId, taskListByCompany("<b>Все активные задачи</b>", all, c, true));
      return true;
    }

    case "/co": {
      const q = rest.trim().toLowerCase().replace(/^#/, "");
      const co = c.projList.find((p) => p.key.toLowerCase() === q || p.title.toLowerCase() === q);
      if (!co) {
        const names = c.projList.filter((p) => !p.parent_id).map((p) => `<code>#${esc(p.key)}</code> ${esc(p.title)}`);
        await send(chatId, names.length
          ? `Какая компания? ${names.join(", ")}`
          : "Компании ещё не заведены: <code>/projects hotels Отели</code>");
        return true;
      }
      const ids = new Set([co.id, ...c.projList.filter((p) => p.parent_id === co.id).map((p) => p.id)]);
      const all = (await Promise.all(c.list.map((p) => tasksOf(p.id, "assignee", sb)))).flat();
      const list = all.filter((t) => t.project_id && ids.has(t.project_id));
      await send(chatId, taskList(`🏢 <b>${esc(co.title)}</b>`, list, c, true));
      return true;
    }

    case "/today": {
      const all = (await Promise.all(c.list.map((p) => tasksOf(p.id, "assignee", sb)))).flat();
      const today = localDay(c.now!, c.s.tz);
      const list = all.filter((t) => t.due_at && localDay(new Date(t.due_at), c.s.tz) <= today);
      await send(chatId, taskListByCompany("<b>Сегодня и просрочено</b>", list, c, true));
      return true;
    }

    case "/task":
      if (!rest) { await send(chatId, "Напишите так: <code>/task Серёже КП по маркетингу до 20:00</code>"); return true; }
      await makeDraft(rest, person, chatId, c);
      return true;

    case "/t": {
      const id = Number(rest.replace(/\D/g, ""));
      const t = id ? await getTask(id, sb) : null;
      if (!t) { await send(chatId, "Не нашёл такую задачу."); return true; }
      await send(chatId, taskCard(t, c), taskKb(t, person));
      return true;
    }

    case "/projects": {
      // «/projects hotels Отели» — компания; «/projects hotels/smm SMM» — направление внутри неё.
      if (rest) {
        if (!person.is_admin) { await send(chatId, "Структуру группы меняет админ."); return true; }
        const [path, ...title] = rest.split(" ");
        const [a, b] = path.toLowerCase().split("/");
        const parent = b ? c.projList.find((p) => p.key.toLowerCase() === a) : null;
        if (b && !parent) { await send(chatId, `Компании <code>#${esc(a)}</code> нет. Сначала: <code>/projects ${esc(a)} Название</code>`); return true; }
        const key = (b ?? a);
        const p = await addProject(key, title.join(" ") || key, { parent_id: parent?.id ?? null }, sb);
        await send(chatId, parent
          ? `Направление добавлено: <b>${esc(parent.title)} · ${esc(p.title)}</b> — тег <code>#${esc(p.key)}</code>`
          : `Компания добавлена: <b>${esc(p.title)}</b> — тег <code>#${esc(p.key)}</code>`);
        return true;
      }
      const roots = c.projList.filter((p) => !p.parent_id);
      const lines = roots.map((r) => {
        const kids = c.projList.filter((p) => p.parent_id === r.id);
        const sub = kids.map((k) => `\n     └ ${esc(k.title)} — <code>#${esc(k.key)}</code>`).join("");
        return `🏢 <b>${esc(r.title)}</b> — <code>#${esc(r.key)}</code>${sub}`;
      });
      await send(chatId, lines.length
        ? `<b>Группа компаний</b>\n\n${lines.join("\n")}\n\n` +
          `Компания: <code>/projects hotels Отели</code>\nНаправление: <code>/projects hotels/smm SMM</code>`
        : "Структура ещё пустая.\n\nКомпания: <code>/projects hotels Отели</code>\nНаправление: <code>/projects hotels/smm SMM</code>");
      return true;
    }

    case "/alias": {
      const parts = rest.split(" ").filter(Boolean);
      const aliases = parts.map((x) => x.replace(/[,]/g, "").toLowerCase()).filter(Boolean);
      await setAliases(person.id, aliases, sb);
      await send(chatId, aliases.length
        ? `Буду узнавать вас как: ${aliases.map((a) => `<code>${esc(a)}</code>`).join(", ")}`
        : "Псевдонимы очищены.");
      return true;
    }

    case "/people": {
      const rows = c.list.map((p) => `• <b>${esc(p.name)}</b>${p.username ? ` @${esc(p.username)}` : ""}${p.is_admin ? " · админ" : ""}\n     псевдонимы: ${p.aliases?.length ? p.aliases.join(", ") : "—"}`);
      await send(chatId, `<b>Команда</b>\n\n${rows.join("\n")}\n\nСвои формы имени задайте так: <code>/alias серёжа сергею сереже</code>`);
      return true;
    }

    case "/stats": {
      const week = new Date(c.now!.getTime() - 7 * 864e5);
      const done = await doneSince(week, sb);
      const live = (await Promise.all(c.list.map((p) => tasksOf(p.id, "assignee", sb)))).flat();
      const overdue = live.filter((t) => t.due_at && new Date(t.due_at) < c.now!);
      const inTime = done.filter((t) => !t.due_at || (t.done_at && new Date(t.done_at) <= new Date(t.due_at)));
      const moved = done.filter((t) => t.snoozes > 0);
      const pct = done.length ? Math.round((inTime.length / done.length) * 100) : 100;
      const perPerson = c.list.map((p) => {
        const d = done.filter((t) => t.assignee_id === p.id).length;
        const o = overdue.filter((t) => t.assignee_id === p.id).length;
        return `• ${esc(p.name)}: закрыто ${d}, просрочено сейчас ${o}`;
      });
      // Разрез по компаниям группы — где именно скапливается.
      const perCompany = c.projList.filter((p) => !p.parent_id).map((co) => {
        const mine = (t: Task) => companyOf(t.project_id, c)?.id === co.id;
        const d = done.filter(mine).length;
        const o = overdue.filter(mine).length;
        const a = live.filter(mine).length;
        return d || o || a ? `• ${esc(co.title)}: активных ${a}, закрыто ${d}${o ? `, просрочено ${o}` : ""}` : "";
      }).filter(Boolean);

      await send(chatId,
        `<b>Неделя</b>\n\n` +
        `Закрыто: <b>${done.length}</b>\nВ срок: <b>${pct}%</b>\nСейчас просрочено: <b>${overdue.length}</b>\nПереносились: ${moved.length}\n\n${perPerson.join("\n")}` +
        (perCompany.length ? `\n\n<b>По компаниям</b>\n${perCompany.join("\n")}` : "") +
        (moved.length ? `\n\n<i>Задачи, которые переносят чаще двух раз, обычно поставлены не тому или не туда — стоит пересобрать, а не давить.</i>` : ""));
      return true;
    }

    default:
      return false;
  }
}

// ── Вебхук ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (SECRET && req.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let u: any;
  try { u = await req.json(); } catch { return NextResponse.json({ ok: true }); }

  try {
    await handle(u);
  } catch (err) {
    console.error("[HQ]", err);
  }
  return NextResponse.json({ ok: true });
}

async function handle(u: any) {
  const cb = u.callback_query;
  const msg = u.message ?? u.edited_message ?? cb?.message;
  const chatId: number | undefined = msg?.chat?.id;
  const from = cb?.from ?? u.message?.from;
  if (!chatId || !from || from.is_bot) return;

  const sb = db();
  const text: string = (u.message?.text ?? u.message?.caption ?? "").trim();
  const isGroup = msg?.chat?.type === "group" || msg?.chat?.type === "supergroup";

  let person = await (async () => {
    const { data } = await sb.from("hq_people").select("*").eq("tg_id", from.id).maybeSingle();
    return data as Person | null;
  })();

  // Перший запуск: /start <код> робить людину адміном.
  if (!person) {
    const code = text.startsWith("/start") ? text.split(/\s+/)[1] : undefined;
    if (BOOTSTRAP && code === BOOTSTRAP) {
      const first = (await people(sb)).length === 0;
      const brand = (await getSettings(sb)).brand;
      person = await addPerson({
        tg_id: from.id,
        name: from.first_name || from.username || `id${from.id}`,
        username: from.username ?? null,
        is_admin: first,
      }, sb);
      await send(chatId, `Готово, <b>${esc(person.name)}</b> — вы в «${esc(brand)}».${first ? " Права админа выданы." : ""}\n\n${HELP}`);
      return;
    }
    if (!isGroup) {
      await send(chatId, `Я рабочий ассистент и отвечаю только своим.\n\nВаш Telegram ID: <code>${from.id}</code> — передайте его администратору, либо пришлите <code>/start КОД</code>.`);
    }
    return;
  }

  const c = await context();
  // Свіжий об'єкт із контексту (там актуальні aliases).
  person = c.people.get(person.id) ?? person;

  // ── Кнопки ──────────────────────────────────────────────────────────────
  if (cb?.data) {
    await answer(cb.id);
    const [ns, rawId, action, arg] = String(cb.data).split(":");
    const id = Number(rawId);
    const task = await getTask(id, sb);
    if (!task) { await send(chatId, "Задача не найдена."); return; }

    if (ns === "d") {
      if (task.creator_id !== person.id) { await send(chatId, "Черновик подтверждает тот, кто ставил задачу."); return; }
      if (action === "x") {
        await updateTask(id, { status: "cancelled" }, sb);
        await edit(chatId, cb.message.message_id, "✖️ Отменено.");
        return;
      }
      if (action === "ok" || action === "force") {
        await edit(chatId, cb.message.message_id, draftCard(task, c));
        await confirmDraft(task, person, c, action === "force");
        return;
      }
      if (action === "who") {
        if (arg) {
          const t = await updateTask(id, { assignee_id: Number(arg) }, sb);
          await edit(chatId, cb.message.message_id, draftCard(t, c), draftKb(t.id));
          return;
        }
        await send(chatId, "Кому поручаем?", kb(c.list.map((p) => [[p.name, `d:${id}:who:${p.id}`]] as [string, string][])));
        return;
      }
      if (action === "when") {
        await setPending(person.id, { kind: "due", task_id: id }, sb);
        await send(chatId, "Когда дедлайн? Напишите: <code>сегодня в 20:00</code>, <code>завтра к обеду</code>, <code>в пятницу в 15:00</code>.");
        return;
      }
      return;
    }

    if (ns === "t") {
      const allowed = task.assignee_id === person.id || task.creator_id === person.id;
      if (!allowed) { await send(chatId, "Это не ваша задача."); return; }
      const updated = await onAction(task, action, arg, person, c);
      if (cb.message?.message_id && action !== "submit") {
        await edit(chatId, cb.message.message_id, taskCard(updated, c), taskKb(updated, person));
      }
      return;
    }
    return;
  }

  // ── Вкладення ───────────────────────────────────────────────────────────
  const file = u.message?.photo?.slice(-1)[0]
    ? { type: "photo" as const, file_id: u.message.photo.slice(-1)[0].file_id }
    : u.message?.document ? { type: "document" as const, file_id: u.message.document.file_id }
      : u.message?.voice ? { type: "voice" as const, file_id: u.message.voice.file_id }
        : u.message?.video ? { type: "video" as const, file_id: u.message.video.file_id }
          : u.message?.audio ? { type: "audio" as const, file_id: u.message.audio.file_id }
            : null;

  // ── Очікувана дія (результат / срок) ────────────────────────────────────
  const pending = person.pending;
  if (pending) {
    const task = await getTask(pending.task_id, sb);
    if (!task) { await setPending(person.id, null, sb); }
    else if (pending.kind === "result") {
      if (file) await addAttachment(task.id, { ...file, caption: "result" }, sb);
      if (text) await updateTask(task.id, { result: text.slice(0, 2000) }, sb);
      const fresh = (await getTask(task.id, sb))!;
      await onAction(fresh, "submitDone", undefined, person, c);
      return;
    }
    else if (pending.kind === "due") {
      const p = parseTask(text, { people: c.list, projects: c.projList, author: person, tz: c.s.tz, now: c.now });
      if (!p.due_at) { await send(chatId, "Не понял срок. Попробуйте: <code>сегодня в 20:00</code> или <code>12.08 в 15:00</code>."); return; }
      await setPending(person.id, null, sb);
      const t = await updateTask(task.id, { due_at: p.due_at.toISOString() }, sb);
      if (t.status === "draft") await confirmDraft(t, person, c);
      else {
        await replaceLadder(t, c.s, sb);
        await send(chatId, `Срок обновлён: <b>${human(p.due_at, c.s.tz, c.now)}</b>`, taskKb(t, person));
      }
      return;
    }
  }

  if (!text && !file) return;

  // ── Команди ─────────────────────────────────────────────────────────────
  if (text.startsWith("/")) {
    const [head, ...rest] = text.split(/\s+/);
    const cmd = head.split("@")[0].toLowerCase();
    if (await onCommand(cmd, rest.join(" ").trim(), person, chatId, c)) return;
    await send(chatId, "Не знаю такой команды. /help");
    return;
  }

  // ── Вільний текст → чернетка ────────────────────────────────────────────
  // У групі беремо тільки те, що починається з «+» — інакше бот з'їсть обговорення.
  const body = isGroup
    ? (text.startsWith("+") ? text.slice(1).trim() : null)
    : text;

  if (!body) {
    // Файл без тексту у приватному чаті — прикріпимо до останньої задачі-чернетки.
    if (file && !isGroup) await send(chatId, "Файл принял. Напишите, к какой задаче он относится, или поставьте задачу текстом — приложу.");
    return;
  }

  await makeDraft(body, person, chatId, c, file ?? undefined);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
