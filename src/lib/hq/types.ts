/** LEGAR HQ — типи асистента. */

export type TaskKind = "task" | "event";
export type TaskStatus = "draft" | "open" | "doing" | "submitted" | "done" | "cancelled";
export type ReminderKind = "lead" | "due" | "escalate";
export type ReminderTarget = "assignee" | "creator" | "both";

export interface Person {
  id: number;
  tg_id: number;
  name: string;
  aliases: string[];
  username: string | null;
  is_admin: boolean;
  active: boolean;
  pending: Pending | null;
}

/** Що бот чекає від людини наступним повідомленням. */
export type Pending =
  | { kind: "result"; task_id: number }
  | { kind: "title"; task_id: number }
  | { kind: "due"; task_id: number };

export interface Project {
  id: number;
  key: string;
  title: string;
  active: boolean;
}

export interface Attachment {
  type: "photo" | "document" | "voice" | "audio" | "video";
  file_id: string;
  caption?: string;
}

export interface Task {
  id: number;
  kind: TaskKind;
  title: string;
  details: string | null;
  project_id: number | null;
  creator_id: number;
  assignee_id: number;
  status: TaskStatus;
  due_at: string | null;
  result: string | null;
  attachments: Attachment[];
  source_chat_id: number | null;
  snoozes: number;
  created_at: string;
  submitted_at: string | null;
  done_at: string | null;
}

export interface Reminder {
  id: number;
  task_id: number;
  fire_at: string;
  kind: ReminderKind;
  label: string | null;
  target: ReminderTarget;
  sent_at: string | null;
}

export interface Settings {
  tz: string;
  digest_morning: string;
  digest_evening: string;
  quiet_from: string;
  quiet_to: string;
  escalate_every_min: number;
  escalate_max: number;
  wip_limit: number;
}

export const DEFAULT_SETTINGS: Settings = {
  tz: "Europe/Kyiv",
  digest_morning: "08:30",
  digest_evening: "20:30",
  quiet_from: "22:00",
  quiet_to: "08:00",
  escalate_every_min: 30,
  escalate_max: 8,
  wip_limit: 3,
};

/** Активні статуси — задача ще «висить». */
export const LIVE: TaskStatus[] = ["open", "doing", "submitted"];
