/**
 * Серцебиття асистента: нагадування, ескалація, дайджести.
 * Викликається щохвилини (pg_cron у Supabase — див. docs/HQ-SETUP.md).
 * Ідемпотентний: кожне нагадування має sent_at, дайджест — ключ дня.
 */

import { NextResponse, type NextRequest } from "next/server";
import { taskCard, taskKb, taskList, taskListByCompany, type Ctx } from "@/lib/hq/render";
import { acceptanceNudge, nextEscalation } from "@/lib/hq/schedule";
import {
  addReminder, db, doneSince, dueReminders, escalationState, getSettings,
  getTask, kvGet, kvSet, liveTasks, markSent, people, projects,
} from "@/lib/hq/store";
import { esc, send } from "@/lib/hq/tg";
import { atLocalTime, delta, human, localDay } from "@/lib/hq/time";
import type { Person, Task } from "@/lib/hq/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KEY = process.env.HQ_CRON_SECRET;

export async function GET(req: NextRequest) {
  if (KEY && req.nextUrl.searchParams.get("key") !== KEY && req.headers.get("x-hq-key") !== KEY) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const now = new Date();
  const sb = db();
  const [s, list, projList] = await Promise.all([getSettings(sb), people(sb), projects(sb)]);
  const c: Ctx = {
    s,
    people: new Map(list.map((p) => [p.id, p])),
    projects: new Map(projList.map((p) => [p.id, p])),
    now,
  };

  const fired = await fireReminders(c, now);
  const queued = await queueEscalations(c, now);
  const digests = await runDigests(c, list, now);

  return NextResponse.json({ ok: true, fired, queued, digests });
}

/** Розсилає нагадування, час яких настав. */
async function fireReminders(c: Ctx, now: Date): Promise<number> {
  const sb = db();
  const due = await dueReminders(now, sb);
  let sent = 0;

  for (const r of due) {
    const task = await getTask(r.task_id, sb);
    if (!task || task.status === "done" || task.status === "cancelled" || task.status === "draft") {
      await markSent([r.id], sb);
      continue;
    }
    const assignee = c.people.get(task.assignee_id);
    const creator = c.people.get(task.creator_id);
    const left = task.due_at ? new Date(task.due_at).getTime() - now.getTime() : 0;

    if (r.kind === "lead" && assignee) {
      const head = task.kind === "event"
        ? `📞 <b>${r.label}</b> — событие`
        : `⏰ <b>${r.label}</b> до дедлайна`;
      await send(assignee.tg_id, `${head}\n\n${taskCard(task, c)}`, taskKb(task, assignee));
    }

    if (r.kind === "due" && assignee) {
      await send(assignee.tg_id,
        `🔔 <b>Срок наступил.</b>\n\n${taskCard(task, c)}\n\nЗакрываем или переносим?`,
        taskKb(task, assignee));
    }

    if (r.kind === "escalate") {
      const overdue = delta(left);
      if ((r.target === "assignee" || r.target === "both") && assignee && task.status !== "submitted") {
        await send(assignee.tg_id,
          `🔥 <b>Просрочено на ${overdue}.</b>\n\n${taskCard(task, c)}\n\nЧто с ней?`,
          taskKb(task, assignee));
      }
      if ((r.target === "creator" || r.target === "both") && creator) {
        const who = assignee ? esc(assignee.name) : "исполнитель";
        const body = task.status === "submitted"
          ? `📤 <b>${who}</b> сдал(а) работу, но вы её ещё не приняли.`
          : `🔥 <b>${who}</b> не закрыл(а) задачу, просрочка ${overdue}.`;
        await send(creator.tg_id, `${body}\n\n${taskCard(task, c)}`, taskKb(task, creator));
      }
    }

    await markSent([r.id], sb);
    sent++;
  }
  return sent;
}

/** Ставить у чергу наступний крок ескалації по кожній простроченій задачі. */
async function queueEscalations(c: Ctx, now: Date): Promise<number> {
  const sb = db();
  const live = await liveTasks(sb);
  let added = 0;

  for (const task of live) {
    const overdue = task.due_at && new Date(task.due_at) < now;
    if (!overdue && task.status !== "submitted") continue;

    const st = await escalationState(task.id, sb);
    if (st.pending) continue;

    const next = task.status === "submitted"
      ? acceptanceNudge(task, c.s, now)
      : nextEscalation(task, c.s, st.sent, st.last, now);

    if (next) { await addReminder(next, sb); added++; }
  }
  return added;
}

// ── Дайджести ─────────────────────────────────────────────────────────────
async function runDigests(c: Ctx, list: Person[], now: Date): Promise<string[]> {
  const sb = db();
  const today = localDay(now, c.s.tz);
  const out: string[] = [];

  for (const slot of ["morning", "evening"] as const) {
    const at = slot === "morning" ? c.s.digest_morning : c.s.digest_evening;
    const target = atLocalTime(now, at, c.s.tz);
    if (now < target) continue;
    // Пропускаємо, якщо запізнилися більше ніж на дві години (перезапуск крона вночі).
    if (now.getTime() - target.getTime() > 2 * 3600e3) continue;
    const seen = await kvGet(`digest:${slot}`, sb);
    if (seen === today) continue;

    const live = await liveTasks(sb);
    for (const p of list) {
      const text = slot === "morning"
        ? morning(p, live, c, now)
        : await evening(p, live, c, now);
      await send(p.tg_id, text);
    }
    await kvSet(`digest:${slot}`, today, sb);
    out.push(slot);
  }
  return out;
}

function split(p: Person, live: Task[], c: Ctx, now: Date) {
  const mine = live.filter((t) => t.assignee_id === p.id);
  const today = localDay(now, c.s.tz);
  return {
    overdue: mine.filter((t) => t.due_at && new Date(t.due_at) < now),
    todayList: mine.filter((t) => t.due_at && localDay(new Date(t.due_at), c.s.tz) === today && new Date(t.due_at) >= now),
    later: mine.filter((t) => !t.due_at || localDay(new Date(t.due_at), c.s.tz) > today),
    waiting: live.filter((t) => t.creator_id === p.id && t.status === "submitted" && t.assignee_id !== p.id),
  };
}

function morning(p: Person, live: Task[], c: Ctx, now: Date): string {
  const { overdue, todayList, waiting } = split(p, live, c, now);
  const events = todayList.filter((t) => t.kind === "event");
  const parts = [`☀️ <b>Доброе утро, ${esc(p.name)}.</b>`];

  if (events.length) {
    parts.push(`\n📞 <b>Сегодня по времени</b>\n` + events.map((t) =>
      `• ${human(new Date(t.due_at!), c.s.tz, now).replace("сегодня в ", "")} — ${esc(t.title)}`).join("\n"));
  }
  parts.push("\n" + taskListByCompany(`<b>Сегодня</b>`, todayList.filter((t) => t.kind !== "event"), c));
  if (overdue.length) parts.push("\n" + taskList(`🔥 <b>Просрочено</b>`, overdue, c));
  if (waiting.length) parts.push("\n" + taskList(`📤 <b>Ждёт вашей приёмки</b>`, waiting, c, true));
  if (!overdue.length && !todayList.length && !waiting.length) parts.push("\nНа сегодня ничего не висит. Хороший день, чтобы закрыть что-то из бэклога.");
  return parts.join("\n");
}

async function evening(p: Person, live: Task[], c: Ctx, now: Date): Promise<string> {
  const sb = db();
  const { overdue, waiting } = split(p, live, c, now);
  const dayStart = atLocalTime(now, "00:00", c.s.tz);
  const done = (await doneSince(dayStart, sb)).filter((t) => t.assignee_id === p.id);
  const tomorrow = localDay(new Date(now.getTime() + 864e5), c.s.tz);
  const next = live.filter((t) => t.assignee_id === p.id && t.due_at && localDay(new Date(t.due_at), c.s.tz) === tomorrow);

  const parts = [`🌙 <b>Итоги дня, ${esc(p.name)}.</b>`, `\nЗакрыто сегодня: <b>${done.length}</b>`];
  if (done.length) parts.push(done.map((t) => `✅ ${esc(t.title)}`).join("\n"));
  if (overdue.length) parts.push("\n" + taskList(`🔥 <b>Осталось просроченным</b>`, overdue, c));
  if (waiting.length) parts.push("\n" + taskList(`📤 <b>Ждёт вашей приёмки</b>`, waiting, c, true));
  parts.push("\n" + taskList(`<b>Завтра</b>`, next, c));
  return parts.join("\n");
}

/** POST — щоб можна було смикати з Vercel Cron або зовнішнього планувальника. */
export const POST = GET;
