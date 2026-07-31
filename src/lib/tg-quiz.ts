/**
 * LEGAR — логіка квіз-кваліфікації Telegram-бота.
 * Чисті функції (без мережі) — перевіряються scripts/tg-quiz.check.mjs
 */

export const SITUATIONS: Record<string, string> = {
  shtraf: "Штраф від ТЦК",
  povistka: "Повістка",
  vlk: "Не згоден з висновком ВЛК",
  szch: "СЗЧ (ст. 407 ККУ)",
  bron: "Бронювання / B2B",
  other: "Інше питання",
};

export const DOCUMENTS: Record<string, string> = {
  yes: "Документ на руках",
  soon: "Ще немає, але терміново",
  none: "Документа немає",
};

export const CITIES: Record<string, string> = {
  kyiv: "Київ",
  lviv: "Львів",
  dnipro: "Дніпро",
  kharkiv: "Харків",
  odesa: "Одеса",
  other: "Інше місто",
};

export const INTENTS: Record<string, string> = {
  ready: "Готовий вирішувати питання",
  consult: "Спочатку консультація юриста",
  info: "Поки просто інформація",
};

export type Step = "situation" | "document" | "city" | "city_text" | "intent" | "phone" | "done";

export interface QuizData {
  step: Step;
  situation?: string;
  document?: string;
  city?: string;
  intent?: string;
  source?: string;
}

/** Наступний крок. `info` завершує без телефону, «інше місто» — з текстовим вводом. */
export function nextStep(step: Step, choice?: string): Step {
  switch (step) {
    case "situation":
      return "document";
    case "document":
      return "city";
    case "city":
      return choice === "other" ? "city_text" : "intent";
    case "city_text":
      return "intent";
    case "intent":
      return choice === "info" ? "done" : "phone";
    default:
      return "done";
  }
}

/** Гарячий лід = готовий до послуги. */
export function leadTemperature(intent?: string): "hot" | "warm" | "cold" {
  if (intent === INTENTS.ready) return "hot";
  if (intent === INTENTS.consult) return "warm";
  return "cold";
}

/** Підсумок для оператора / поля message. */
export function summarize(d: QuizData): string {
  return [
    `Ситуація: ${d.situation ?? "—"}`,
    `Документ: ${d.document ?? "—"}`,
    `Місто: ${d.city ?? "—"}`,
    `Намір: ${d.intent ?? "—"}`,
    d.source ? `Джерело: ${d.source}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
