/**
 * Доступ до даних асистента.
 * Таблиці hq_* ще не в згенерованих типах Supabase — тому службові касти,
 * як у /api/board.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { ladder } from "./schedule";
import type { NewReminder } from "./schedule";
import {
  DEFAULT_SETTINGS, LIVE,
  type Attachment, type Pending, type Person, type Project,
  type Reminder, type Settings, type Task, type TaskStatus,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const db = () => createServiceClient() as any;

// ── Налаштування ──────────────────────────────────────────────────────────
export async function getSettings(sb = db()): Promise<Settings> {
  const { data } = await sb.from("hq_settings").select("key,value");
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const row of data ?? []) out[row.key] = row.value;
  return out as unknown as Settings;
}

export async function kvGet(key: string, sb = db()): Promise<unknown> {
  const { data } = await sb.from("hq_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? null;
}

export async function kvSet(key: string, value: unknown, sb = db()): Promise<void> {
  await sb.from("hq_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
}

// ── Люди ──────────────────────────────────────────────────────────────────
export async function people(sb = db()): Promise<Person[]> {
  const { data } = await sb.from("hq_people").select("*").eq("active", true).order("id");
  return (data ?? []) as Person[];
}

export async function personByTg(tg_id: number, sb = db()): Promise<Person | null> {
  const { data } = await sb.from("hq_people").select("*").eq("tg_id", tg_id).maybeSingle();
  return (data as Person) ?? null;
}

export async function personById(id: number, sb = db()): Promise<Person | null> {
  const { data } = await sb.from("hq_people").select("*").eq("id", id).maybeSingle();
  return (data as Person) ?? null;
}

export async function addPerson(
  p: { tg_id: number; name: string; username?: string | null; is_admin?: boolean }, sb = db(),
): Promise<Person> {
  const { data } = await sb
    .from("hq_people")
    .upsert(
      { tg_id: p.tg_id, name: p.name, username: p.username ?? null, is_admin: p.is_admin ?? false, active: true },
      { onConflict: "tg_id" },
    )
    .select("*")
    .single();
  return data as Person;
}

export async function setAliases(id: number, aliases: string[], sb = db()): Promise<void> {
  await sb.from("hq_people").update({ aliases }).eq("id", id);
}

export async function setPending(id: number, pending: Pending | null, sb = db()): Promise<void> {
  await sb.from("hq_people").update({ pending }).eq("id", id);
}

// ── Проєкти ───────────────────────────────────────────────────────────────
export async function projects(sb = db()): Promise<Project[]> {
  const { data } = await sb.from("hq_projects").select("*").eq("active", true).order("id");
  return (data ?? []) as Project[];
}

export async function addProject(key: string, title: string, sb = db()): Promise<Project> {
  const { data } = await sb
    .from("hq_projects")
    .upsert({ key, title, active: true }, { onConflict: "key" })
    .select("*")
    .single();
  return data as Project;
}

// ── Задачі ────────────────────────────────────────────────────────────────
export async function getTask(id: number, sb = db()): Promise<Task | null> {
  const { data } = await sb.from("hq_tasks").select("*").eq("id", id).maybeSingle();
  return (data as Task) ?? null;
}

export async function createTask(
  t: Partial<Task> & { title: string; creator_id: number; assignee_id: number }, sb = db(),
): Promise<Task> {
  const { data, error } = await sb.from("hq_tasks").insert({
    kind: t.kind ?? "task",
    title: t.title,
    details: t.details ?? null,
    project_id: t.project_id ?? null,
    creator_id: t.creator_id,
    assignee_id: t.assignee_id,
    status: t.status ?? "draft",
    due_at: t.due_at ?? null,
    attachments: t.attachments ?? [],
    source_chat_id: t.source_chat_id ?? null,
  }).select("*").single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: number, patch: Record<string, unknown>, sb = db()): Promise<Task> {
  const { data, error } = await sb
    .from("hq_tasks")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Task;
}

export async function addAttachment(id: number, a: Attachment, sb = db()): Promise<Task> {
  const t = await getTask(id, sb);
  const list = [...(t?.attachments ?? []), a];
  return updateTask(id, { attachments: list }, sb);
}

export async function liveTasks(sb = db()): Promise<Task[]> {
  const { data } = await sb
    .from("hq_tasks").select("*")
    .in("status", LIVE)
    .order("due_at", { ascending: true, nullsFirst: false });
  return (data ?? []) as Task[];
}

export async function tasksOf(
  personId: number, role: "assignee" | "creator" = "assignee", sb = db(),
): Promise<Task[]> {
  const { data } = await sb
    .from("hq_tasks").select("*")
    .eq(role === "assignee" ? "assignee_id" : "creator_id", personId)
    .in("status", LIVE)
    .order("due_at", { ascending: true, nullsFirst: false });
  return (data ?? []) as Task[];
}

/** Скільки задач людина реально тягне зараз — для ліміту WIP. */
export async function wipCount(personId: number, sb = db()): Promise<number> {
  const { count } = await sb
    .from("hq_tasks").select("id", { count: "exact", head: true })
    .eq("assignee_id", personId)
    .in("status", ["open", "doing"] as TaskStatus[]);
  return count ?? 0;
}

/** Закриті за період — для вечірнього дайджесту і тижневого зрізу. */
export async function doneSince(since: Date, sb = db()): Promise<Task[]> {
  const { data } = await sb
    .from("hq_tasks").select("*")
    .eq("status", "done")
    .gte("done_at", since.toISOString())
    .order("done_at");
  return (data ?? []) as Task[];
}

// ── Нагадування ───────────────────────────────────────────────────────────
export async function replaceLadder(task: Task, s: Settings, sb = db()): Promise<void> {
  await sb.from("hq_reminders").delete().eq("task_id", task.id).is("sent_at", null);
  const rows = ladder(task, s);
  if (rows.length) await sb.from("hq_reminders").insert(rows);
}

export async function dropReminders(taskId: number, sb = db()): Promise<void> {
  await sb.from("hq_reminders").delete().eq("task_id", taskId).is("sent_at", null);
}

export async function addReminder(r: NewReminder, sb = db()): Promise<void> {
  await sb.from("hq_reminders").insert(r);
}

export async function dueReminders(now: Date, sb = db()): Promise<Reminder[]> {
  const { data } = await sb
    .from("hq_reminders").select("*")
    .is("sent_at", null)
    .lte("fire_at", now.toISOString())
    .order("fire_at")
    .limit(100);
  return (data ?? []) as Reminder[];
}

export async function markSent(ids: number[], sb = db()): Promise<void> {
  if (!ids.length) return;
  await sb.from("hq_reminders").update({ sent_at: new Date().toISOString() }).in("id", ids);
}

/** Статистика ескалацій по задачі: скільки вже пішло і коли остання. */
export async function escalationState(
  taskId: number, sb = db(),
): Promise<{ sent: number; pending: boolean; last: Date | null }> {
  const { data } = await sb
    .from("hq_reminders").select("fire_at,sent_at")
    .eq("task_id", taskId).eq("kind", "escalate")
    .order("fire_at");
  const rows = (data ?? []) as { fire_at: string; sent_at: string | null }[];
  const sent = rows.filter((r) => r.sent_at).length;
  const pending = rows.some((r) => !r.sent_at);
  const last = rows.length ? new Date(rows[rows.length - 1].fire_at) : null;
  return { sent, pending, last };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
