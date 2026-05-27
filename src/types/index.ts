/**
 * Глобальні типи що не належать жодному конкретному модулю.
 */

export type Locale = "uk";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  createdAt: string;
}

export type ServiceSlug =
  | "ai-diagnostyka"
  | "antyshtraf-tck-360"
  | "vlk-pro"
  | "tck-suprovid"
  | "szch-zahyst"
  | "sos-24-7"
  | "b2b-bronyuvannya";

export type CitySlug = "kyiv" | "lviv" | "dnipro" | "kharkiv" | "odesa";
