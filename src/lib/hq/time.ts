/**
 * Робота з часом у таймзоні засновників — без зовнішніх залежностей.
 * Усе в БД зберігається в UTC; користувач бачить і вводить локальний час.
 */

/** Зсув таймзони (мс) у конкретний момент — коректно переживає перехід на літній час. */
function tzOffset(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(at);
  const p: Record<string, number> = {};
  for (const { type, value } of parts) if (type !== "literal") p[type] = Number(value);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
  return asUtc - at.getTime();
}

export interface Wall { y: number; m: number; d: number; h: number; min: number; dow: number }

/** Локальні «настінні» частини моменту. dow: 0 = неділя. */
export function wall(at: Date, tz: string): Wall {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false, weekday: "short",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).formatToParts(at);
  const p: Record<string, string> = {};
  for (const { type, value } of parts) p[type] = value;
  const dows = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    y: Number(p.year), m: Number(p.month), d: Number(p.day),
    h: Number(p.hour) % 24, min: Number(p.minute),
    dow: Math.max(0, dows.indexOf(p.weekday)),
  };
}

/** Локальний настінний час → UTC-момент. Дві ітерації прибирають похибку на межі DST. */
export function fromWall(y: number, m: number, d: number, h: number, min: number, tz: string): Date {
  const guess = Date.UTC(y, m - 1, d, h, min, 0);
  const off1 = tzOffset(new Date(guess), tz);
  const off2 = tzOffset(new Date(guess - off1), tz);
  return new Date(guess - off2);
}

/** Той самий день, інша година: «сьогодні о 20:00». */
export function atLocalTime(base: Date, hhmm: string, tz: string, addDays = 0): Date {
  const w = wall(base, tz);
  const [h, min] = hhmm.split(":").map(Number);
  return fromWall(w.y, w.m, w.d + addDays, h, min || 0, tz);
}

/** Локальна дата у форматі YYYY-MM-DD — ключ «на який день» для дайджестів. */
export function localDay(at: Date, tz: string): string {
  const w = wall(at, tz);
  return `${w.y}-${String(w.m).padStart(2, "0")}-${String(w.d).padStart(2, "0")}`;
}

const MONTHS = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
const MONTHS_RU = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const DOWS_RU = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

/** «сегодня в 20:00», «завтра в 09:00», «14 авг в 15:30» — як бачить засновник. */
export function human(at: Date, tz: string, now = new Date()): string {
  const w = wall(at, tz);
  const time = `${String(w.h).padStart(2, "0")}:${String(w.min).padStart(2, "0")}`;
  const day = localDay(at, tz);
  if (day === localDay(now, tz)) return `сегодня в ${time}`;
  if (day === localDay(new Date(now.getTime() + 864e5), tz)) return `завтра в ${time}`;
  if (day === localDay(new Date(now.getTime() - 864e5), tz)) return `вчера в ${time}`;
  const within = Math.abs(at.getTime() - now.getTime()) < 6 * 864e5;
  const dow = within ? `${DOWS_RU[w.dow]}, ` : "";
  return `${dow}${w.d} ${MONTHS_RU[w.m - 1]} в ${time}`;
}

/** «через 2 ч 15 мин» / «просрочено на 40 мин». */
export function delta(ms: number): string {
  const abs = Math.abs(ms);
  const min = Math.round(abs / 60000);
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60);
  const rest = min % 60;
  if (h < 24) return rest ? `${h} ч ${rest} мин` : `${h} ч`;
  const d = Math.floor(h / 24);
  return `${d} дн ${h % 24} ч`;
}

/** Українська дата для логів/адмінки. */
export function humanUa(at: Date, tz: string): string {
  const w = wall(at, tz);
  return `${w.d} ${MONTHS[w.m - 1]}, ${String(w.h).padStart(2, "0")}:${String(w.min).padStart(2, "0")}`;
}

/** Чи потрапляє момент у тихі години (наприклад 22:00–08:00). */
export function inQuiet(at: Date, tz: string, from: string, to: string): boolean {
  const w = wall(at, tz);
  const cur = w.h * 60 + w.min;
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  const a = fh * 60 + (fm || 0);
  const b = th * 60 + (tm || 0);
  return a <= b ? cur >= a && cur < b : cur >= a || cur < b;
}

/** Зсунути нагадування з тихих годин на ранок. */
export function outOfQuiet(at: Date, tz: string, from: string, to: string): Date {
  if (!inQuiet(at, tz, from, to)) return at;
  const w = wall(at, tz);
  const [th, tm] = to.split(":").map(Number);
  const sameDay = fromWall(w.y, w.m, w.d, th, tm || 0, tz);
  return sameDay > at ? sameDay : fromWall(w.y, w.m, w.d + 1, th, tm || 0, tz);
}
