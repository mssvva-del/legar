/**
 * GA4 events — заготовка.
 * Підключити gtag через next/script у layout, коли буде MEASUREMENT_ID.
 */

type AnalyticsEvent =
  | { name: "lead_submitted"; service?: string; city?: string }
  | { name: "ai_diagnostic_started" }
  | { name: "sos_opened"; source: "header" | "sticky" | "hero" | "footer" }
  | { name: "phone_clicked"; source: string }
  | { name: "service_card_clicked"; service: string };

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag === "function") {
    const { name, ...params } = event;
    w.gtag("event", name, params);
  } else if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event);
  }
}
