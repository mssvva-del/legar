import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { leadApiSchema } from "@/lib/validations";
import { createServiceClient } from "@/lib/supabase/server";
import type { LeadInsert } from "@/lib/supabase/types";
import { CONTACTS } from "@/lib/constants";
import { sendEmail } from "@/lib/emails/send";
import { leadConfirmationTemplate } from "@/lib/emails/templates/lead-confirmation";
import { sendMetaLead } from "@/lib/meta-capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/leads
 * Приймає заявку з форми, валідує, зберігає у Supabase,
 * сповіщає в Telegram (поки що console.log-заглушка).
 */
export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Невалідний JSON у тілі запиту" },
      { status: 400 },
    );
  }

  const parsed = leadApiSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Помилка валідації",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Контекст для Meta CAPI (server-side подія Lead)
  const capiCtx = {
    eventId: data.event_id || crypto.randomUUID(),
    phone: data.phone,
    name: data.name,
    city: data.city || undefined,
    clientIp:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
    eventSourceUrl: req.headers.get("referer") || "https://legar.com.ua/landing/antishtraf",
    fbp: data.fbp,
    fbc: data.fbc,
  };

  // Якщо Supabase ще не налаштований у .env.local — повертаємо помилку 503,
  // але форма принаймні валідує і не падає.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[LEGAR] Supabase env vars не налаштовані — заявка не збережена:",
      data,
    );
    await notifyTelegram(data, null);
    await sendMetaLead(capiCtx);
    return NextResponse.json(
      {
        success: true,
        leadId: Math.floor(Math.random() * 9000) + 1000,
        warning: "Supabase не налаштований — заявка не збережена у БД",
      },
      { status: 200 },
    );
  }

  const supabase = createServiceClient();

  const payload: LeadInsert = {
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    city: data.city || null,
    service: data.service || null,
    message: data.message,
    utm_source: data.utm_source ?? null,
    utm_medium: data.utm_medium ?? null,
    utm_campaign: data.utm_campaign ?? null,
    status: "new",
  };

  // Cast обходить generic-обмеження @supabase/ssr v0.10 — Database-тип не завжди
  // інферится у chain'i після createServerClient. На реальній БД з згенерованими
  // через `supabase gen types typescript` типами це працює коректно.
  const { data: inserted, error } = (await supabase
    .from("leads")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(payload as any)
    .select("id")
    .single()) as { data: { id: number } | null; error: { message: string } | null };

  if (error || !inserted) {
    // eslint-disable-next-line no-console
    console.error("[LEGAR] Supabase insert error:", error);
    return NextResponse.json(
      { error: "Не вдалося зберегти заявку. Спробуйте ще раз." },
      { status: 500 },
    );
  }

  await notifyTelegram(data, inserted.id);

  // Send confirmation email if provided
  if (data.email) {
    const template = leadConfirmationTemplate({
      name: data.name,
      service: data.service ?? undefined,
      leadId: inserted.id,
    });
    await sendEmail({ to: data.email, ...template });
  }

  // Meta CAPI — серверна подія Lead (дедуп з пікселем за event_id)
  await sendMetaLead(capiCtx);

  return NextResponse.json({ success: true, leadId: inserted.id, eventId: capiCtx.eventId });
}

/**
 * Telegram-сповіщення — заглушка.
 * Коли налаштуєш TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID — розкоментуй fetch.
 */
async function notifyTelegram(
  data: ReturnType<typeof leadApiSchema.parse>,
  leadId: number | null,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = [
    `🛡 *Нова заявка LEGAR* ${leadId ? `#${leadId}` : "(без БД)"}`,
    ``,
    `*Ім'я:* ${escapeMd(data.name)}`,
    `*Телефон:* \`${data.phone}\``,
    data.email ? `*E-mail:* ${escapeMd(data.email)}` : null,
    data.city ? `*Місто:* ${escapeMd(data.city)}` : null,
    data.service ? `*Послуга:* ${escapeMd(data.service)}` : null,
    ``,
    `*Повідомлення:*`,
    escapeMd(data.message),
    ``,
    `📞 ${CONTACTS.phone}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!token || !chatId) {
    // eslint-disable-next-line no-console
    console.info("[LEGAR Telegram заглушка]\n" + text);
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[LEGAR] Telegram notification failed:", err);
  }
}

function escapeMd(s: string): string {
  return s.replace(/([_*`\[\]])/g, "\\$1");
}
