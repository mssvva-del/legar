/**
 * LEGAR — логіка Telegram-бота: тріаж, збір справи, строки, скоринг.
 * Чисті функції — перевіряються scripts/tg-quiz.check.mjs
 */

/** Три двері. Безкоштовних дзвінків немає в жодній. */
export const DOORS: Record<string, string> = {
  case: "У мене вже є документ / проблема",
  consult: "Потрібна консультація юриста",
  info: "Просто питання",
};

export const SITUATIONS: Record<string, string> = {
  shtraf: "Штраф від ТЦК",
  povistka: "Повістка",
  vlk: "Не згоден з висновком ВЛК",
  szch: "СЗЧ (ст. 407 ККУ)",
  bron: "Бронювання / B2B",
  other: "Інше питання",
};

/** Коли отримано документ — від цього рахуємо строк на оскарження. */
export const WHEN: Record<string, string> = {
  today: "Сьогодні або вчора",
  d2_5: "2–5 днів тому",
  d6_10: "6–10 днів тому",
  d10p: "Більше 10 днів тому",
  not_yet: "Ще не отримав",
};

/** Що людина вже встигла зробити — впливає на складність справи. */
export const DONE: Record<string, string> = {
  nothing: "Нічого не робив",
  signed: "Підписав документи",
  paid: "Вже оплатив штраф",
  appealed: "Подавав скаргусам",
};

export const CITIES: Record<string, string> = {
  kyiv: "Київ", lviv: "Львів", dnipro: "Дніпро",
  kharkiv: "Харків", odesa: "Одеса", other: "Інше місто",
};

/** Платний вхід. Безкоштовних консультацій не даємо. */
export const CONSULTS: Record<string, { title: string; price: number; desc: string }> = {
  express: { title: "Експрес-розбір", price: 490, desc: "Дзвінок юриста 15–20 хв: оцінка ситуації та чіткий план дій." },
  full: { title: "Повна консультація", price: 1200, desc: "30–40 хв з аналізом ваших документів + письмовий план дій." },
};

export type Step =
  | "door" | "situation" | "when" | "photo" | "done_before" | "city" | "phone"
  | "consult_pick" | "consult_pay" | "consult_phone"
  | "chat";

export interface QuizData {
  step: Step;
  door?: string;
  situation?: string;
  when?: string;
  hasPhoto?: boolean;
  photoId?: string;
  doneBefore?: string;
  city?: string;
  consult?: string;
  paidClaimed?: boolean;
  source?: string;
}

/** Строк на оскарження постанови ТЦК — 10 днів з дня вручення. */
const APPEAL_DAYS = 10;

export function deadline(when?: string): { left: number | null; text: string; urgent: boolean } {
  switch (when) {
    case "today":
      return { left: APPEAL_DAYS, text: `На оскарження лишилось ~${APPEAL_DAYS} днів — час є, але зволікати не варто.`, urgent: false };
    case "d2_5":
      return { left: 6, text: "На оскарження лишилось приблизно 5–8 днів. Варто діяти цього тижня.", urgent: true };
    case "d6_10":
      return { left: 2, text: "⚠️ Лишилось 1–4 дні. Це критично — документи треба готувати вже сьогодні.", urgent: true };
    case "d10p":
      return { left: 0, text: "Строк, найімовірніше, сплинув. Це не вирок: закон дозволяє просити про поновлення строку, якщо є поважна причина — адвокат оцінить шанси.", urgent: true };
    default:
      return { left: null, text: "Строк ще не почався — це найкращий момент підготуватися заздалегідь.", urgent: false };
  }
}

/** Скоринг: кому дзвонити першим. */
export function score(d: QuizData): { temp: "hot" | "warm" | "cold"; label: string } {
  if (d.door === "consult" && d.paidClaimed) return { temp: "hot", label: "🔥 ОПЛАТИВ КОНСУЛЬТАЦІЮ" };
  if (d.door === "case") {
    const strong = d.when && d.when !== "not_yet" && d.doneBefore !== "paid";
    return strong
      ? { temp: "hot", label: "🔥 ГАРЯЧА СПРАВА" }
      : { temp: "warm", label: "🟡 справа зі складністю" };
  }
  if (d.door === "consult") return { temp: "warm", label: "💬 обрав консультацію, не оплатив" };
  return { temp: "cold", label: "❄️ інформаційний" };
}

/** Підсумок справи для менеджера. */
export function caseSummary(d: QuizData): string {
  const parts = [
    d.situation && `Ситуація: ${d.situation}`,
    d.when && `Документ: ${WHEN[d.when] ?? d.when}`,
    d.doneBefore && `Вже зроблено: ${DONE[d.doneBefore] ?? d.doneBefore}`,
    d.city && `Місто: ${d.city}`,
    d.hasPhoto ? "📎 фото документа є" : null,
    d.consult && CONSULTS[d.consult] && `Обрав: ${CONSULTS[d.consult].title} ${CONSULTS[d.consult].price} грн`,
    d.paidClaimed ? "💳 заявив про оплату" : null,
    d.source && `Джерело: ${d.source}`,
  ].filter(Boolean);
  const dl = d.when ? deadline(d.when) : null;
  if (dl?.left !== null && dl) parts.push(`Строк: ~${dl.left} дн.`);
  return parts.join(" · ");
}
