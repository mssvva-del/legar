import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  SITUATIONS, DOCUMENTS, INTENTS,
  nextStep, leadTemperature, summarize,
  type Step, type QuizData,
} from "@/lib/tg-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = process.env.TELEGRAM_CLIENT_BOT_TOKEN;
const NOTIFY_BOT = process.env.TELEGRAM_BOT_TOKEN;
const NOTIFY_CHAT = process.env.TELEGRAM_CHAT_ID;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

async function tg(method: string, body: Record<string, unknown>, token = BOT) {
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[LEGAR TG]", method, err);
  }
}

const kb = (rows: [string, string][][]) => ({
  inline_keyboard: rows.map((r) => r.map(([text, data]) => ({ text, callback_data: data }))),
});

const ask = {
  situation: (chat_id: number) =>
    tg("sendMessage", {
      chat_id,
      text: "Вітаю! Я помічник LEGAR 🛡\n\nВідповім на 4 короткі питання — і адвокат-партнер НААУ підкаже, що робити саме у вашій ситуації.\n\n*Яке у вас питання?*",
      parse_mode: "Markdown",
      reply_markup: kb([
        [["Штраф від ТЦК", "sit:shtraf"]],
        [["Повістка", "sit:povistka"]],
        [["Не згоден з ВЛК", "sit:vlk"]],
        [["СЗЧ (ст. 407)", "sit:szch"]],
        [["Інше питання", "sit:other"]],
      ]),
    }),
  document: (chat_id: number) =>
    tg("sendMessage", {
      chat_id,
      text: "Чи є документ на руках (постанова, повістка, висновок)?",
      reply_markup: kb([
        [["Так, документ у мене", "doc:yes"]],
        [["Ще немає, але терміново", "doc:soon"]],
        [["Документа немає", "doc:none"]],
      ]),
    }),
  city: (chat_id: number) =>
    tg("sendMessage", {
      chat_id,
      text: "З якого ви міста? (напишіть одним словом)",
      reply_markup: { force_reply: true },
    }),
  intent: (chat_id: number) =>
    tg("sendMessage", {
      chat_id,
      text: "Що вам зараз потрібно?",
      reply_markup: kb([
        [["Готовий вирішувати питання", "int:ready"]],
        [["Спочатку консультація юриста", "int:consult"]],
        [["Поки просто інформація", "int:info"]],
      ]),
    }),
  phone: (chat_id: number, intent: string) =>
    tg("sendMessage", {
      chat_id,
      text:
        intent === "ready"
          ? "Добре. Залишіть номер — менеджер зателефонує протягом 15 хвилин і передасть справу адвокату.\n\nНатисніть кнопку нижче — номер підставиться автоматично."
          : "Консультація адвоката-партнера НААУ — *1 200 грн*, до 30 хвилин, розбір саме вашої ситуації з планом дій.\n\nЗалиште номер — менеджер зв'яжеться і узгодить час.",
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [[{ text: "📱 Поділитися номером", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }),
};

async function finish(chat_id: number, data: QuizData, username?: string) {
  const temp = leadTemperature(data.intent);
  const summary = summarize(data);

  await tg("sendMessage", {
    chat_id,
    text: "Дякую! Заявку прийнято ✅\n\nМенеджер зв'яжеться найближчим часом. Тримайте телефон поруч.\n\nМатеріали та новини: @legarukr",
    reply_markup: { remove_keyboard: true },
  });

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("leads") as any).insert({
        name: data.name || username || `TG ${chat_id}`,
        phone: data.phone || "",
        city: data.city || null,
        service: data.situation || null,
        message: `[Telegram-бот, ${temp.toUpperCase()}] ${summary}`,
        utm_source: "telegram",
        utm_medium: "bot",
        utm_campaign: data.source || "tg-quiz",
        status: "new",
      });
    } catch (err) {
      console.error("[LEGAR TG] insert", err);
    }
  }

  const icon = temp === "hot" ? "🔥 ГАРЯЧИЙ" : temp === "warm" ? "💬 КОНСУЛЬТАЦІЯ" : "❄️ холодний";
  await tg(
    "sendMessage",
    {
      chat_id: NOTIFY_CHAT,
      text: `${icon} лід з Telegram-бота\n\nІм'я: ${data.name || username || "—"}\nТелефон: ${data.phone || "не залишив"}\nTG: @${username || "—"}\n\n${summary}`,
      disable_web_page_preview: true,
    },
    NOTIFY_BOT,
  );
}

export async function POST(req: NextRequest) {
  if (SECRET && req.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: Record<string, any>;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = update.message ?? update.callback_query?.message;
  const chat_id: number | undefined = msg?.chat?.id;
  if (!chat_id) return NextResponse.json({ ok: true });

  const from = update.callback_query?.from ?? update.message?.from;
  const username: string | undefined = from?.username;
  const supabase = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row } = (await (supabase.from("tg_sessions") as any)
    .select("step, data")
    .eq("chat_id", chat_id)
    .maybeSingle()) as { data: { step: Step; data: QuizData } | null };

  let step: Step = row?.step ?? "situation";
  const data: QuizData = row?.data ?? {};

  const save = async (s: Step) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("tg_sessions") as any).upsert({
      chat_id, step: s, data, username: username ?? null, updated_at: new Date().toISOString(),
    });
  };

  // ── /start [payload] ──────────────────────────────────────────────────
  const text: string | undefined = update.message?.text;
  if (text?.startsWith("/start")) {
    const payload = text.split(" ")[1]?.trim();
    if (payload) data.source = payload;
    if (payload && SITUATIONS[payload]) {
      data.situation = SITUATIONS[payload];
      step = "document";
      await save(step);
      await ask.document(chat_id);
    } else {
      step = "situation";
      await save(step);
      await ask.situation(chat_id);
    }
    return NextResponse.json({ ok: true });
  }

  // ── inline-кнопки ─────────────────────────────────────────────────────
  const cb = update.callback_query;
  if (cb?.data) {
    await tg("answerCallbackQuery", { callback_query_id: cb.id });
    const [kind, val] = String(cb.data).split(":");

    if (kind === "sit" && SITUATIONS[val]) {
      data.situation = SITUATIONS[val];
      step = nextStep("situation");
      await save(step);
      await ask.document(chat_id);
    } else if (kind === "doc" && DOCUMENTS[val]) {
      data.document = DOCUMENTS[val];
      step = nextStep("document");
      await save(step);
      await ask.city(chat_id);
    } else if (kind === "int" && INTENTS[val]) {
      data.intent = INTENTS[val];
      step = nextStep("intent", val);
      await save(step);
      if (step === "phone") {
        await ask.phone(chat_id, val);
      } else {
        await tg("sendMessage", {
          chat_id,
          text: "Ок! Ось коротко головне:\n\n• Не підписуйте документів, яких не розумієте\n• На оскарження постанови ТЦК закон дає 10 днів\n• Фіксуйте всі порушення (фото, свідки)\n\nКорисні матеріали: legar.com.ua/blog\nКанал: @legarukr\n\nЗахочете розібрати свою ситуацію — просто напишіть сюди /start",
          disable_web_page_preview: true,
        });
        await save("done");
      }
    }
    return NextResponse.json({ ok: true });
  }

  // ── місто (текст) ─────────────────────────────────────────────────────
  if (step === "city" && text) {
    data.city = text.slice(0, 60);
    step = nextStep("city");
    await save(step);
    await ask.intent(chat_id);
    return NextResponse.json({ ok: true });
  }

  // ── телефон (контакт або текст) ───────────────────────────────────────
  const contact = update.message?.contact;
  if (step === "phone" && (contact || text)) {
    data.phone = contact?.phone_number ?? text!.slice(0, 20);
    data.name = contact?.first_name ?? from?.first_name;
    await save("done");
    await finish(chat_id, data, username);
    return NextResponse.json({ ok: true });
  }

  // ── усе інше ──────────────────────────────────────────────────────────
  if (step === "done") {
    await tg("sendMessage", {
      chat_id,
      text: "Ваша заявка вже у роботі — менеджер зв'яжеться. Щоб почати нову — /start",
    });
  } else {
    await ask[step === "situation" ? "situation" : step === "document" ? "document" : "city"](chat_id);
  }
  return NextResponse.json({ ok: true });
}
