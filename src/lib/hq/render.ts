/** Як задача виглядає у Telegram. Уся копірайтинг-частина — тут. */

import { esc, kb } from "./tg";
import { delta, human } from "./time";
import type { Person, Project, Settings, Task } from "./types";

export interface Ctx {
  people: Map<number, Person>;
  projects: Map<number, Project>;
  s: Settings;
  now?: Date;
}

const STATUS: Record<string, string> = {
  draft: "✏️", open: "🆕", doing: "🔧", submitted: "📤", done: "✅", cancelled: "✖️",
};

export const nameOf = (id: number, c: Ctx) => c.people.get(id)?.name ?? "—";

/** Компанія холдингу, до якої належить напрямок (або сам напрямок, якщо він верхній). */
export function companyOf(projectId: number | null, c: Ctx): Project | null {
  let p = projectId ? c.projects.get(projectId) ?? null : null;
  for (let i = 0; i < 5 && p?.parent_id; i++) p = c.projects.get(p.parent_id) ?? null;
  return p;
}

/** «Отели · Маркетинг» — компанія і напрямок в одному рядку. */
export function projectPath(projectId: number | null, c: Ctx): string {
  if (!projectId) return "";
  const p = c.projects.get(projectId);
  if (!p) return "";
  const parent = p.parent_id ? c.projects.get(p.parent_id) : null;
  return parent ? `${parent.title} · ${p.title}` : p.title;
}

/** Строка срока: «⏰ сегодня в 20:00 · через 3 ч» / «🔥 просрочено на 40 мин». */
export function dueLine(task: Task, c: Ctx): string {
  if (!task.due_at) return "⏰ срок не задан";
  const now = c.now ?? new Date();
  const due = new Date(task.due_at);
  const left = due.getTime() - now.getTime();
  const when = human(due, c.s.tz, now);
  if (left < 0 && task.status !== "done") return `🔥 <b>просрочено на ${delta(left)}</b> (срок был ${when})`;
  return `⏰ ${when} · через ${delta(left)}`;
}

export function taskCard(task: Task, c: Ctx): string {
  const path = projectPath(task.project_id, c);
  const head = `${STATUS[task.status] ?? "•"} <b>#${task.id}</b>${path ? ` · ${esc(path)}` : ""}${task.kind === "event" ? " · 📞 событие" : ""}`;
  const lines = [
    head,
    `<b>${esc(task.title)}</b>`,
    `👤 ${esc(nameOf(task.assignee_id, c))}  ·  от ${esc(nameOf(task.creator_id, c))}`,
    dueLine(task, c),
  ];
  if (task.details) lines.push(`\n${esc(task.details)}`);
  if (task.snoozes > 0) lines.push(`↻ переносов: ${task.snoozes}`);
  if (task.result) lines.push(`\n📎 <b>Результат:</b> ${esc(task.result)}`);
  return lines.join("\n");
}

/** Кнопки залежать від того, хто дивиться: виконавець чи постановник. */
export function taskKb(task: Task, viewer: Person) {
  const id = task.id;
  const rows: [string, string][][] = [];
  const isAssignee = task.assignee_id === viewer.id;
  const isCreator = task.creator_id === viewer.id;

  if (task.status === "open" && isAssignee) rows.push([["▶️ Взял в работу", `t:${id}:take`], ["✅ Готово", `t:${id}:submit`]]);
  else if (task.status === "doing" && isAssignee) rows.push([["✅ Готово", `t:${id}:submit`]]);

  if ((task.status === "open" || task.status === "doing") && isAssignee) {
    rows.push([["+1 час", `t:${id}:snooze:60`], ["+1 день", `t:${id}:snooze:1440`], ["🚫 Не успею", `t:${id}:risk`]]);
  }

  if (task.status === "submitted" && isCreator) rows.push([["👍 Принять", `t:${id}:accept`], ["↩️ Вернуть", `t:${id}:reject`]]);
  if (task.status === "submitted" && isAssignee && !isCreator) rows.push([["🔁 Напомнить о приёмке", `t:${id}:ping`]]);

  if (isCreator && task.status !== "done" && task.status !== "cancelled") rows.push([["✖️ Снять задачу", `t:${id}:cancel`]]);

  return rows.length ? kb(rows) : {};
}

/** Картка-чернетка: бот показує, як зрозумів, і чекає підтвердження. */
export function draftCard(task: Task, c: Ctx, notes: string[] = []): string {
  const path = projectPath(task.project_id, c);
  const lines = [
    "Так понял:",
    ``,
    `<b>${esc(task.title)}</b>`,
    `👤 исполнитель: <b>${esc(nameOf(task.assignee_id, c))}</b>`,
    `⏰ срок: <b>${task.due_at ? human(new Date(task.due_at), c.s.tz, c.now) : "не задан"}</b>`,
    path ? `📁 ${esc(path)}` : "📁 компания: не указана",
    task.kind === "event" ? "📞 это событие — напомню за сутки, 2 часа, час и 10 минут" : "",
    task.attachments.length ? `📎 вложений: ${task.attachments.length}` : "",
    notes.length ? `\n<i>${esc(notes.join("; "))}</i>` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

export function draftKb(id: number) {
  return kb([
    [["✅ Поставить", `d:${id}:ok`]],
    [["👤 Исполнитель", `d:${id}:who`], ["⏰ Срок", `d:${id}:when`]],
    [["✖️ Отмена", `d:${id}:x`]],
  ]);
}

/** Список задач одним повідомленням — «/my», «/all», дайджести. */
export function taskList(title: string, tasks: Task[], c: Ctx, showAssignee = false): string {
  if (!tasks.length) return `${title}\n\nПусто 🎉`;
  const now = c.now ?? new Date();
  const rows = tasks.map((t) => {
    const due = t.due_at ? new Date(t.due_at) : null;
    const overdue = due && due.getTime() < now.getTime();
    const mark = overdue ? "🔥" : STATUS[t.status] ?? "•";
    const when = due ? human(due, c.s.tz, now) : "без срока";
    const who = showAssignee ? ` · ${esc(nameOf(t.assignee_id, c))}` : "";
    return `${mark} <b>#${t.id}</b> ${esc(t.title)}\n     ${when}${who}`;
  });
  return `${title}\n\n${rows.join("\n")}`;
}

/** Те саме, але з розбивкою по компаніях групи — погляд власника холдингу. */
export function taskListByCompany(title: string, tasks: Task[], c: Ctx, showAssignee = false): string {
  if (!tasks.length) return `${title}\n\nПусто 🎉`;
  const groups = new Map<string, Task[]>();
  for (const t of tasks) {
    const co = companyOf(t.project_id, c);
    const key = co ? co.title : "Без компании";
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  // Одна компанія — розбивка тільки заважає.
  if (groups.size <= 1) return taskList(title, tasks, c, showAssignee);
  const blocks = [...groups.entries()].map(([co, list]) =>
    taskList(`🏢 <b>${esc(co)}</b> — ${list.length}`, list, c, showAssignee));
  return `${title}\n\n${blocks.join("\n\n")}`;
}

export const HELP = `<b>Я — ваш ассистент по задачам.</b>

<b>Поставить задачу</b> — просто напишите обычным текстом:
• <code>Серёже КП по маркетингу до 20:00</code>
• <code>мне позвонить в банк завтра в 11:00</code>
• <code>Вике созвон по отелям в пятницу в 15:00 #hotels</code>
Я разберу исполнителя, срок и компанию и покажу карточку на подтверждение.

<b>Структура группы</b>
Задачи раскладываются по компаниям холдинга и направлениям внутри них:
<code>Отели → Маркетинг</code>, <code>LEGAR → Продажи</code>. В тексте достаточно
тега <code>#hotels</code> или упоминания названия. Сводки и статистика
показывают разрез по компаниям — видно, где сейчас всё висит.

<b>Что я делаю дальше</b>
• напоминаю по лестнице: за сутки → за 3 часа → за час → в момент срока;
• для звонков и встреч: за сутки → 2 часа → час → 10 минут;
• если срок прошёл — пингую исполнителя и сразу сообщаю постановщику;
• «Готово» не закрывает задачу — её принимает тот, кто ставил;
• утром и вечером присылаю сводку.

<b>Команды</b>
/my — мои задачи
/all — все задачи обоих, по компаниям
/today — что сегодня
/co &lt;компания&gt; — всё по одной компании
/task &lt;текст&gt; — поставить задачу явно
/t &lt;id&gt; — открыть карточку задачи
/projects — структура группы компаний
/stats — сводка за неделю по компаниям
/me — мой Telegram ID
/help — эта справка`;
