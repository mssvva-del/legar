import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Класи-утиліта: об'єднує conditional classes та вирішує Tailwind-конфлікти.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматує число у гривневий формат з нерозривним пробілом.
 *   8500 → "8 500 грн"
 */
export function formatUah(amount: number): string {
  return `${amount.toLocaleString("uk-UA").replace(/ /g, " ")} грн`;
}

/**
 * Безпечне обрізання тексту для prevіew карток.
 */
export function truncate(text: string, max = 140): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}
