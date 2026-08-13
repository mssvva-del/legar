/**
 * Драбина нагадувань і ескалація.
 *
 * Задача:  за добу → за 3 год → за 1 год → у момент дедлайну → далі ескалація.
 * Подія:   за добу → за 2 год → за 1 год → за 10 хв (дзвінок не можна «доробити пізніше»).
 *
 * Після дедлайну задача не замовкає: пінг виконавцю кожні N хвилин,
 * постановник дізнається одразу і далі раз на годину.
 */

import { outOfQuiet } from "./time";
import type { ReminderKind, ReminderTarget, Settings, Task } from "./types";

export interface NewReminder {
  task_id: number;
  fire_at: string;
  kind: ReminderKind;
  label: string;
  target: ReminderTarget;
}

/** Хвилини до дедлайну → підпис. */
const TASK_LADDER: [number, string][] = [
  [24 * 60, "за сутки"],
  [180, "за 3 часа"],
  [60, "за час"],
  [0, "дедлайн"],
];

const EVENT_LADDER: [number, string][] = [
  [24 * 60, "за сутки"],
  [120, "за 2 часа"],
  [60, "за час"],
  [10, "через 10 минут"],
];

export function ladder(task: Task, s: Settings, now = new Date()): NewReminder[] {
  if (!task.due_at) return [];
  const due = new Date(task.due_at).getTime();
  const steps = task.kind === "event" ? EVENT_LADDER : TASK_LADDER;
  const out: NewReminder[] = [];

  // Йдемо від найтерміновішого кроку: якщо після зсуву з тихих годин два
  // нагадування злипаються в один час — лишається те, що ближче до дедлайну.
  const kept: number[] = [];
  for (const [minsBefore, label] of [...steps].sort((a, b) => a[0] - b[0])) {
    const raw = new Date(due - minsBefore * 60000);
    // Момент дедлайну не зсуваємо — це факт, а не зручність.
    const fire = minsBefore === 0 ? raw : outOfQuiet(raw, s.tz, s.quiet_from, s.quiet_to);
    // Зсув із тихих годин не має перестрибувати сам дедлайн.
    if (fire.getTime() >= due && minsBefore !== 0) continue;
    if (fire.getTime() <= now.getTime() + 30000) continue;
    if (kept.some((k) => Math.abs(k - fire.getTime()) < 15 * 60000)) continue;
    kept.push(fire.getTime());
    out.push({
      task_id: task.id,
      fire_at: fire.toISOString(),
      kind: minsBefore === 0 ? "due" : "lead",
      label,
      target: "assignee",
    });
  }
  return out.sort((a, b) => a.fire_at.localeCompare(b.fire_at));
}

/**
 * Наступний крок ескалації для простроченої задачі.
 * `sentCount` — скільки ескалацій вже пішло, `lastFire` — коли остання.
 */
export function nextEscalation(
  task: Task, s: Settings, sentCount: number, lastFire: Date | null, now = new Date(),
): NewReminder | null {
  if (!task.due_at) return null;
  if (sentCount >= s.escalate_max) return null;

  const due = new Date(task.due_at);
  const step = s.escalate_every_min * 60000;
  const base = lastFire ? lastFire.getTime() + step : due.getTime() + step;
  const fire = outOfQuiet(new Date(Math.max(base, now.getTime())), s.tz, s.quiet_from, s.quiet_to);

  return {
    task_id: task.id,
    fire_at: fire.toISOString(),
    kind: "escalate",
    // Постановник дізнається про прострочення одразу, далі — кожну другу ітерацію.
    label: `просрочено`,
    target: sentCount === 0 || sentCount % 2 === 1 ? "both" : "assignee",
  };
}

/**
 * Нагадування постановнику, що робота здана і чекає приймання.
 * Без цього «здав → забули прийняти» стає новою чорною дірою.
 */
export function acceptanceNudge(task: Task, s: Settings, now = new Date()): NewReminder | null {
  if (task.status !== "submitted" || !task.submitted_at) return null;
  const waited = now.getTime() - new Date(task.submitted_at).getTime();
  if (waited < 2 * 3600e3) return null;
  const fire = outOfQuiet(now, s.tz, s.quiet_from, s.quiet_to);
  return {
    task_id: task.id,
    fire_at: fire.toISOString(),
    kind: "escalate",
    label: "ждёт приёмки",
    target: "creator",
  };
}
