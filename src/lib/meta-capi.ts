import crypto from "node:crypto";

/**
 * Meta Conversions API (server-side) — дублює браузерну подію `Lead`
 * з сервера для кращого матчингу та дедуплікації (через event_id).
 *
 * Навіщо: серверні події з хешованим телефоном піднімають Event Match Quality
 * → Meta дешевше знаходить схожих людей → нижчий CPL.
 *
 * Env (Vercel):
 *   NEXT_PUBLIC_META_PIXEL_ID — ID пікселя (вже налаштовано)
 *   META_CAPI_TOKEN           — токен доступу для CAPI (System User / Page token)
 * Якщо чогось немає — функція тихо no-op (форма не падає).
 */

const GRAPH = "https://graph.facebook.com/v25.0";

function sha256(v: string): string {
  return crypto.createHash("sha256").update(v).digest("hex");
}

/** Нормалізує укр. номер у цифри з кодом країни (для хешування за специфікацією Meta). */
function phoneToDigits(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("380")) return d;
  if (d.startsWith("0")) return "38" + d; // 0XXXXXXXXX -> 380XXXXXXXXX
  return d;
}

export interface MetaLeadParams {
  eventId: string;
  phone: string;
  name?: string;
  city?: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
}

/** Відправляє подію Lead у CAPI. Повертає true якщо надіслано, false якщо пропущено/помилка. */
export async function sendMetaLead(p: MetaLeadParams): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    // eslint-disable-next-line no-console
    console.info("[LEGAR CAPI] пропущено: немає NEXT_PUBLIC_META_PIXEL_ID або META_CAPI_TOKEN");
    return false;
  }

  const user_data: Record<string, unknown> = {};
  const phoneDigits = phoneToDigits(p.phone);
  if (phoneDigits) user_data.ph = sha256(phoneDigits);
  if (p.name) {
    const parts = p.name.trim().toLowerCase().split(/\s+/);
    if (parts[0]) user_data.fn = sha256(parts[0]);
    if (parts.length > 1) user_data.ln = sha256(parts[parts.length - 1]);
  }
  if (p.city) user_data.ct = sha256(p.city.trim().toLowerCase());
  user_data.country = sha256("ua");
  if (p.clientIp) user_data.client_ip_address = p.clientIp;
  if (p.userAgent) user_data.client_user_agent = p.userAgent;
  if (p.fbp) user_data.fbp = p.fbp;
  if (p.fbc) user_data.fbc = p.fbc;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: p.eventId, // дедуп з браузерним fbq('track','Lead',{},{eventID})
        event_source_url: p.eventSourceUrl,
        user_data,
      },
    ],
  };

  try {
    const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("[LEGAR CAPI] помилка:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[LEGAR CAPI] виняток:", err);
    return false;
  }
}
