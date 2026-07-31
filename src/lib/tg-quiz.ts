/**
 * LEGAR — логіка квіз-кваліфікації Telegram-бота.
 * Чисті функції (без мережі) — щоб їх можна було перевірити тестом.
 */

export const SITUATIONS: Record<string, string> = {
  shtraf: "Штраф від ТЦК",
  povistka: "Повістка",
  vlk: "Не згоден з висновком ВЛК",
  szch: "СЗЧ (ст. 407 ККУ)",
  other: "Інше питання",
};

export const DOCUMENTS: Record<string, string> = {
  yes: "Документ на руках",
  soon: "Ще немає, але терміново",
  none: "Документа немає",
};

export const INTENTS: Record<string, string> = {
  ready: "Готовий вирішувати питання",
  consult: "Спочатку консультація юриста",
  info: "Поки просто інформація",
};

export type Step = "situation" | "document" | "city" | "intent" | "phone" | "done";

export interface QuizData {
  situation?: string;
  document?: string;
  city?: string;
  intent?: string;
  phone?: string;
  name?: string;
  source?: string;
}

/** Наступний крок після відповіді. `info` завершує діалог без телефону. */
export function nextStep(step: Step, intent?: string): Step {
  switch (step) {
    case "situation":
      return "document";
    case "document":
      return "city";
    case "city":
      return "intent";
    case "intent":
      return intent === "info" ? "done" : "phone";
    case "phone":
      return "done";
    default:
      return "done";
  }
}

/** Гарячий лід = готовий до послуги. Решта — тепла/холодна. */
export function leadTemperature(intent?: string): "hot" | "warm" | "cold" {
  if (intent === "ready") return "hot";
  if (intent === "consult") return "warm";
  return "cold";
}

/** Підсумок відповідей для оператора / поля message у БД. */
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
