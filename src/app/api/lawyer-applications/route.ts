import { NextResponse, type NextRequest } from "next/server";
import { lawyerApplicationSchema } from "@/lib/validations";
import { createServiceClient } from "@/lib/supabase/server";
import { CONTACTS } from "@/lib/constants";
import { sendEmail } from "@/lib/emails/send";
import { lawyerApplicationReceivedTemplate } from "@/lib/emails/templates/lawyer-application-received";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/lawyer-applications
 * Приймає заявку від адвоката-партнера, валідує, зберігає у Supabase,
 * надсилає сповіщення в Telegram.
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

  const parsed = lawyerApplicationSchema.safeParse(json);
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

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    // eslint-disable-next-line no-console
    console.warn("[LEGAR] Supabase не налаштований — заявка адвоката не збережена:", data);
    await notifyTelegramLawyer(data, null);
    return NextResponse.json({ success: true, warning: "Supabase не налаштований" });
  }

  const supabase = createServiceClient();

  const payload = {
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    city: data.city,
    naau_certificate: data.naau_certificate,
    years_practice: data.years_practice,
    specializations: data.specializations,
    monthly_capacity: data.monthly_capacity ?? null,
    has_military_practice: data.has_military_practice ?? null,
    comment: data.comment ?? null,
    status: "new",
  };

  const { data: inserted, error } = (await supabase
    .from("lawyer_applications")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(payload as any)
    .select("id")
    .single()) as { data: { id: number } | null; error: { message: string } | null };

  if (error || !inserted) {
    // eslint-disable-next-line no-console
    console.error("[LEGAR] lawyer_applications insert error:", error);
    return NextResponse.json(
      { error: "Не вдалося зберегти заявку. Спробуйте ще раз." },
      { status: 500 },
    );
  }

  await notifyTelegramLawyer(data, inserted.id);

  // Send confirmation email
  const template = lawyerApplicationReceivedTemplate({
    name: data.full_name,
    applicationId: inserted.id,
  });
  await sendEmail({ to: data.email, ...template });

  return NextResponse.json({ success: true, applicationId: inserted.id });
}

type LawyerData = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  naau_certificate: string;
  years_practice: number;
  specializations: string[];
  monthly_capacity?: number;
  has_military_practice?: boolean;
  comment?: string;
};

async function notifyTelegramLawyer(data: LawyerData, id: number | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = [
    `⚖️ *Нова заявка АДВОКАТА* ${id ? `#${id}` : "(без БД)"}`,
    ``,
    `*ПІБ:* ${escapeMd(data.full_name)}`,
    `*Телефон:* \`${data.phone}\``,
    `*Email:* ${escapeMd(data.email)}`,
    `*Місто:* ${escapeMd(data.city)}`,
    `*Свідоцтво НААУ:* ${escapeMd(data.naau_certificate)}`,
    `*Стаж:* ${data.years_practice} р.`,
    `*Спеціалізації:* ${data.specializations.join(", ")}`,
    data.monthly_capacity ? `*Кількість справ/міс:* ${data.monthly_capacity}` : null,
    data.has_military_practice != null
      ? `*Досвід у військовому праві:* ${data.has_military_practice ? "Так" : "Ні"}`
      : null,
    data.comment ? `\n*Коментар:*\n${escapeMd(data.comment)}` : null,
    ``,
    `📞 ${CONTACTS.phone}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!token || !chatId) {
    // eslint-disable-next-line no-console
    console.info("[LEGAR Telegram заглушка — адвокат]\n" + text);
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
    console.error("[LEGAR] Telegram lawyer notification failed:", err);
  }
}

function escapeMd(s: string): string {
  return s.replace(/([_*`\[\]])/g, "\\$1");
}
