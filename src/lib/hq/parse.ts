/**
 * Розбір задачі з живого тексту: «Серёже КП по маркетингу до 20:00 #hotels».
 * Правила, без AI — швидко, передбачувано і безкоштовно.
 * AI-розбір голосу підключається другим етапом поверх цього ж інтерфейсу.
 */

import { fromWall, wall } from "./time";
import type { Person, Project, TaskKind } from "./types";

export interface Parsed {
  title: string;
  kind: TaskKind;
  due_at: Date | null;
  assignee: Person | null;
  project: Project | null;
  /** Що саме розпізнали — показуємо в картці підтвердження. */
  notes: string[];
}

// Без \b і \w: у JS вони визначені через [A-Za-z0-9_] і на кирилиці не працюють.
const EVENT_WORDS = /(звонок|звонк|созвон|созвониться|встреч|планёрк|планерк|call|zoom|эфир|интервью|презентац|переговор)/i;

/** Кінець робочого дня, коли назвали дату без часу. */
const EOD = "19:00";
const DAYPARTS: Record<string, string> = {
  "утром": "09:00", "с утра": "09:00",
  "днём": "13:00", "днем": "13:00", "к обеду": "13:00", "в обед": "13:00",
  "вечером": "19:00", "к вечеру": "19:00",
  "к ночи": "21:00", "ночью": "23:00",
};
const DOW_WORDS: Record<string, number> = {
  "понедельник": 1, "вторник": 2, "среду": 3, "среда": 3, "четверг": 4,
  "пятницу": 5, "пятница": 5, "субботу": 6, "суббота": 6, "воскресенье": 0,
  "пн": 1, "вт": 2, "ср": 3, "чт": 4, "пт": 5, "сб": 6, "вс": 0,
};

interface Cut { start: number; end: number }

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").trim();

/** Мʼяке порівняння імені: «серёже», «сергею», «сергей» → «сергей». */
function nameMatches(token: string, person: Person): boolean {
  const t = norm(token);
  if (!t || t.length < 2) return false;
  const candidates = [person.name, ...(person.aliases ?? []), person.username ?? ""]
    .filter(Boolean)
    .map(norm);
  for (const c of candidates) {
    if (!c) continue;
    if (t === c) return true;
    // Відмінки: «серёже» ≈ «сергей» — спільний корінь і близька довжина.
    if (t.length >= 4 && c.length >= 4 && t.slice(0, 3) === c.slice(0, 3) && Math.abs(t.length - c.length) <= 3) return true;
  }
  return false;
}

/** Витягає виконавця: @username, «мне»/«себе» або імʼя на початку тексту. */
function findAssignee(
  text: string, people: Person[], author: Person, cuts: Cut[],
): { person: Person | null; note?: string } {
  const at = /(^|\s)@([a-z0-9_]{3,})/i.exec(text);
  if (at) {
    const p = people.find((x) => norm(x.username ?? "") === norm(at[2]));
    if (p) {
      cuts.push({ start: at.index + at[1].length, end: at.index + at[0].length });
      return { person: p };
    }
  }

  const self = /(^|\s)(мне|себе|я сам|сам)(\s|,|$)/i.exec(text);
  if (self) {
    cuts.push({ start: self.index + self[1].length, end: self.index + self[0].length - (self[3] === "" ? 0 : self[3].length) });
    return { person: author, note: "себе" };
  }

  // Імʼя серед перших трьох слів — «Серёже подготовить КП».
  // Автора теж перевіряємо: «Вике подготовить КП» від Віки — задача собі.
  const words = text.split(/\s+/).slice(0, 3);
  let offset = 0;
  for (const w of words) {
    const idx = text.indexOf(w, offset);
    offset = idx + w.length;
    const clean = w.replace(/[,:—-]+$/g, "");
    const p = people.find((x) => nameMatches(clean, x));
    if (p) {
      cuts.push({ start: idx, end: idx + w.length });
      return { person: p };
    }
  }
  return { person: null };
}

function findProject(text: string, projects: Project[], cuts: Cut[]): Project | null {
  const tag = /(^|\s)#([a-z0-9_-]{2,})/i.exec(text);
  if (tag) {
    const p = projects.find((x) => norm(x.key) === norm(tag[2]));
    if (p) {
      cuts.push({ start: tag.index + tag[1].length, end: tag.index + tag[0].length });
      return p;
    }
  }
  // Згадка назви: беремо найконкретніший збіг — напрямок важливіший за компанію.
  const t = norm(text);
  const words = t.split(/[^а-яёa-z0-9]+/).filter(Boolean);
  const mentions = (title: string) => {
    const n = norm(title);
    if (n.length < 3) return false;
    if (t.includes(n)) return true;
    // «по отелям» → «Отели»: однослівні назви впізнаємо у будь-якому відмінку.
    if (n.includes(" ")) return false;
    return words.some((w) => w.length >= 4 && n.length >= 4 && w.slice(0, 4) === n.slice(0, 4) && Math.abs(w.length - n.length) <= 3);
  };
  const hits = projects.filter((p) => p.active && mentions(p.title));
  hits.sort((a, b) => (b.parent_id ? 1 : 0) - (a.parent_id ? 1 : 0) || b.title.length - a.title.length);
  return hits[0] ?? null;
}

/** Розбір дедлайну. Повертає момент у UTC або null. */
function findDue(text: string, tz: string, now: Date, cuts: Cut[]): { due: Date | null; note?: string } {
  const t = text.toLowerCase().replace(/ё/g, "е");
  const w = wall(now, tz);
  const push = (m: RegExpExecArray) => cuts.push({ start: m.index, end: m.index + m[0].length });
  const hm = (raw?: string, fallback = EOD): [number, number] => {
    if (!raw) { const [h, mi] = fallback.split(":").map(Number); return [h, mi]; }
    const [h, mi] = raw.replace(/[.-]/, ":").split(":").map(Number);
    return [h, mi || 0];
  };

  // через N минут / часов / дней
  const rel = /через\s+(\d+)\s*(мин[а-яё]*|час[а-яё]*|дн[а-яё]*|недел[а-яё]*)/.exec(t);
  if (rel) {
    push(rel);
    const n = Number(rel[1]);
    const unit = rel[2];
    const ms = unit.startsWith("мин") ? n * 6e4
      : unit.startsWith("час") ? n * 36e5
        : unit.startsWith("дн") ? n * 864e5
          : n * 7 * 864e5;
    return { due: new Date(now.getTime() + ms) };
  }

  // DD.MM(.YYYY) [в HH:MM]
  const dm = /(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?(?:\s*(?:в|о|к|до)?\s*(\d{1,2}[:.]\d{2}))?/.exec(t);
  if (dm) {
    push(dm);
    const [h, mi] = hm(dm[4]);
    const year = dm[3] ? (dm[3].length === 2 ? 2000 + Number(dm[3]) : Number(dm[3])) : w.y;
    return { due: fromWall(year, Number(dm[2]), Number(dm[1]), h, mi, tz) };
  }

  // сегодня / завтра / послезавтра [+ время или часть дня]
  const day = /(послезавтра|сегодня|завтра)(?:\s+(?:в|к|до|о)?\s*(\d{1,2}[:.]\d{2}|\d{1,2}\s*(?:ч|часов|часа)?))?/.exec(t);
  if (day) {
    push(day);
    const add = day[1] === "завтра" ? 1 : day[1] === "послезавтра" ? 2 : 0;
    let raw = day[2]?.trim();
    if (raw && !/[:.]/.test(raw)) raw = `${parseInt(raw, 10)}:00`;
    // «завтра к обеду» — час беремо з частини доби і теж прибираємо з назви.
    const partKey = raw ? undefined : Object.keys(DAYPARTS).find((k) => t.includes(k));
    if (partKey) { const i = t.indexOf(partKey); cuts.push({ start: i, end: i + partKey.length }); }
    const [h, mi] = hm(raw, partKey ? DAYPARTS[partKey] : EOD);
    return { due: fromWall(w.y, w.m, w.d + add, h, mi, tz) };
  }

  // в понедельник / во вторник [+ время]
  const dow = /(?:в|во|к)\s+(понедельник|вторник|среду|среда|четверг|пятницу|пятница|субботу|суббота|воскресенье)(?:\s+(?:в|к|до)?\s*(\d{1,2}[:.]\d{2}))?/.exec(t);
  if (dow) {
    push(dow);
    const target = DOW_WORDS[dow[1]];
    let add = (target - w.dow + 7) % 7;
    if (add === 0) add = 7;
    const [h, mi] = hm(dow[2]);
    return { due: fromWall(w.y, w.m, w.d + add, h, mi, tz) };
  }

  // до конца дня / до конца недели
  const eod = /до\s+конца\s+(дня|недели)/.exec(t);
  if (eod) {
    push(eod);
    const [h, mi] = hm(undefined);
    const add = eod[1] === "дня" ? 0 : (5 - w.dow + 7) % 7;
    return { due: fromWall(w.y, w.m, w.d + add, h, mi, tz) };
  }

  // до 20:00 / к 20:00 / в 15:30 — сьогодні, а якщо вже минуло — завтра
  const time = /(?:до|к|в|о|на)\s*(\d{1,2}[:.]\d{2})/.exec(t) ?? /(?:^|\s)(\d{1,2}:\d{2})(?:\s|$)/.exec(t);
  if (time) {
    push(time);
    const [h, mi] = hm(time[1]);
    let due = fromWall(w.y, w.m, w.d, h, mi, tz);
    if (due.getTime() <= now.getTime()) {
      due = fromWall(w.y, w.m, w.d + 1, h, mi, tz);
      return { due, note: "время уже прошло — поставил на завтра" };
    }
    return { due };
  }

  // утром / вечером без дати
  const partKey = Object.keys(DAYPARTS).find((k) => t.includes(k));
  if (partKey) {
    const i = t.indexOf(partKey);
    cuts.push({ start: i, end: i + partKey.length });
    const [h, mi] = hm(DAYPARTS[partKey]);
    let due = fromWall(w.y, w.m, w.d, h, mi, tz);
    if (due.getTime() <= now.getTime()) due = fromWall(w.y, w.m, w.d + 1, h, mi, tz);
    return { due };
  }

  return { due: null };
}

/** Прибирає розпізнані шматки з тексту, лишаючи чисту назву задачі. */
function strip(text: string, cuts: Cut[]): string {
  const sorted = [...cuts].sort((a, b) => b.start - a.start);
  let out = text;
  for (const c of sorted) {
    if (c.start < 0 || c.end > out.length || c.start >= c.end) continue;
    out = out.slice(0, c.start) + " " + out.slice(c.end);
  }
  return out
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,:—-]+|[\s,:—-]+$/g, "")
    .trim();
}

export function parseTask(
  raw: string,
  ctx: { people: Person[]; projects: Project[]; author: Person; tz: string; now?: Date },
): Parsed {
  const now = ctx.now ?? new Date();
  const text = raw.replace(/\s+/g, " ").trim();
  const cuts: Cut[] = [];
  const notes: string[] = [];

  const { person: assignee, note: aNote } = findAssignee(text, ctx.people, ctx.author, cuts);
  const project = findProject(text, ctx.projects, cuts);
  const { due, note: dNote } = findDue(text, ctx.tz, now, cuts);
  if (aNote) notes.push(aNote);
  if (dNote) notes.push(dNote);

  const title = strip(text, cuts) || text;
  const kind: TaskKind = EVENT_WORDS.test(text) ? "event" : "task";

  return { title: title.charAt(0).toUpperCase() + title.slice(1), kind, due_at: due, assignee, project, notes };
}
