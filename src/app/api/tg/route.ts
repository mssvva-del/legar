import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { aiReply } from "@/lib/tg-ai";
import {
  SITUATIONS, DOCUMENTS, CITIES, INTENTS,
  nextStep, leadTemperature, summarize,
  type Step, type QuizData,
} from "@/lib/tg-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

const say = (chat_id: number, text: string, extra: Record<string, unknown> = {}) =>
  tg("sendMessage", { chat_id, text, parse_mode: "Markdown", disable_web_page_preview: true, ...extra });

const kb = (rows: [string, string][][]) => ({
  reply_markup: { inline_keyboard: rows.map((r) => r.map(([text, callback_data]) => ({ text, callback_data }))) },
});

// ── Питання ────────────────────────────────────────────────────────────────
const ASK: Record<string, (chat_id: number) => Promise<void>> = {
  situation: (c) =>
    say(c, "Вітаю! Я AI-помічник *LEGAR* 🛡\n\nВідповім на кілька коротких питань — і адвокат-партнер НААУ розбере саме вашу ситуацію.\n\nМожете також просто написати мені питання своїми словами.\n\n*З чим потрібна допомога?*",
      kb([[["Штраф від ТЦК", "sit:shtraf"]], [["Повістка", "sit:povistka"]], [["Не згоден з ВЛК", "sit:vlk"]], [["СЗЧ (ст. 407)", "sit:szch"]], [["Бронювання / бізнес", "sit:bron"]], [["Інше питання", "sit:other"]]])),
  document: (c) =>
    say(c, "Чи є документ на руках — постанова, повістка, висновок ВЛК?",
      kb([[["Так, документ у мене", "doc:yes"]], [["Ще немає, але терміново", "doc:soon"]], [["Документа немає", "doc:none"]]])),
  city: (c) =>
    say(c, "З якого ви міста?",
      kb([[["Київ", "cty:kyiv"], ["Львів", "cty:lviv"]], [["Дніпро", "cty:dnipro"], ["Харків", "cty:kharkiv"]], [["Одеса", "cty:odesa"], ["Інше місто", "cty:other"]]])),
  city_text: (c) => say(c, "Напишіть назву міста:"),
  intent: (c) =>
    say(c, "Що вам зараз потрібно?",
      kb([[["Готовий вирішувати питання", "int:ready"]], [["Спочатку консультація юриста", "int:consult"]], [["Поки просто інформація", "int:info"]]])),
  phone: (c) => Promise.resolve(),
};

const askPhone = (chat_id: number, hot: boolean) =>
  say(chat_id,
    hot
      ? "Добре. Залиште номер — менеджер зателефонує протягом 15 хвилин, далі справу веде адвокат-партнер НААУ.\n\n👇 Натисніть кнопку — номер підставиться автоматично."
      : "Консультація адвоката-партнера НААУ — *1 200 грн*, до 30 хвилин: розбір вашої ситуації і чіткий план дій.\n\nЗалиште номер — менеджер зв'яжеться та узгодить зручний час 👇",
    { reply_markup: { keyboard: [[{ text: "📱 Поділитися номером", request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } });

// ── Сесія живе у таблиці leads як чернетка (status='draft', phone='tg:<id>') ──
const key = (chat_id: number) => `tg:${chat_id}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadSession(sb: any, chat_id: number): Promise<{ id: number; d: QuizData } | null> {
  const { data } = await sb.from("leads").select("id, message").eq("phone", key(chat_id)).eq("status", "draft").maybeSingle();
  if (!data) return null;
  try { return { id: data.id, d: JSON.parse(data.message) as QuizData }; } catch { return null; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveSession(sb: any, chat_id: number, id: number | null, d: QuizData, name?: string) {
  const payload = { phone: key(chat_id), message: JSON.stringify(d), status: "draft", name: name || `TG ${chat_id}`, city: d.city ?? null, service: d.situation ?? null, utm_source: "telegram", utm_medium: "bot", utm_campaign: d.source ?? "tg-quiz" };
  if (id) await sb.from("leads").update(payload).eq("id", id);
  else await sb.from("leads").insert(payload);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function finish(sb: any, chat_id: number, id: number | null, d: QuizData, phone: string, name?: string, username?: string) {
  const temp = leadTemperature(d.intent);
  const icon = temp === "hot" ? "🔥 ГАРЯЧИЙ" : temp === "warm" ? "💬 КОНСУЛЬТАЦІЯ" : "❄️ холодний";
  const summary = summarize(d);

  const final = { phone, name: name || username || `TG ${chat_id}`, city: d.city ?? null, service: d.situation ?? null, message: `[Telegram-бот ${temp.toUpperCase()}] ${summary}`, status: "new", utm_source: "telegram", utm_medium: "bot", utm_campaign: d.source ?? "tg-quiz" };
  if (id) await sb.from("leads").update(final).eq("id", id);
  else await sb.from("leads").insert(final);

  await say(chat_id, "Дякую! Заявку прийнято ✅\n\nМенеджер зв'яжеться найближчим часом — тримайте телефон поруч.\n\nПоки чекаєте, можете написати мені будь-яке питання — відповім.", { reply_markup: { remove_keyboard: true } });

  await tg("sendMessage", {
    chat_id: NOTIFY_CHAT,
    text: `${icon} лід з Telegram-бота\n\nІм'я: ${final.name}\nТелефон: ${phone}\nTG: @${username ?? "—"}\n\n${summary}`,
    disable_web_page_preview: true,
  }, NOTIFY_BOT);
}

// ── Webhook ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (SECRET && req.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let u: any;
  try { u = await req.json(); } catch { return NextResponse.json({ ok: true }); }

  const cb = u.callback_query;
  const msg = u.message ?? cb?.message;
  const chat_id: number | undefined = msg?.chat?.id;
  if (!chat_id) return NextResponse.json({ ok: true });

  const from = cb?.from ?? u.message?.from;
  const username: string | undefined = from?.username;
  const firstName: string | undefined = from?.first_name;
  const text: string | undefined = u.message?.text;
  const contact = u.message?.contact;

  const sb = createServiceClient();
  const sess = await loadSession(sb, chat_id);
  const d: QuizData = sess?.d ?? { step: "situation" };
  const id = sess?.id ?? null;

  // /start [payload]
  if (text?.startsWith("/start")) {
    const payload = text.split(" ")[1]?.trim();
    const fresh: QuizData = { step: "situation", source: payload };
    if (payload && SITUATIONS[payload]) {
      fresh.situation = SITUATIONS[payload];
      fresh.step = "document";
    }
    await saveSession(sb, chat_id, id, fresh, firstName);
    await ASK[fresh.step](chat_id);
    return NextResponse.json({ ok: true });
  }

  // Кнопки
  if (cb?.data) {
    await tg("answerCallbackQuery", { callback_query_id: cb.id });
    const [kind, val] = String(cb.data).split(":");
    const map: Record<string, [Record<string, string>, keyof QuizData, Step]> = {
      sit: [SITUATIONS, "situation", "situation"],
      doc: [DOCUMENTS, "document", "document"],
      cty: [CITIES, "city", "city"],
      int: [INTENTS, "intent", "intent"],
    };
    const entry = map[kind];
    if (entry && entry[0][val]) {
      const [dict, field, cur] = entry;
      if (!(kind === "cty" && val === "other")) (d as unknown as Record<string, unknown>)[field] = dict[val];
      d.step = nextStep(cur, val);
      await saveSession(sb, chat_id, id, d, firstName);

      if (d.step === "phone") await askPhone(chat_id, val === "ready");
      else if (d.step === "done")
        await say(chat_id, "Ок! Головне коротко:\n\n• Не підписуйте документів, яких не розумієте\n• Строки на оскарження обмежені — не зволікайте\n• Фіксуйте порушення: фото, свідки, копії\n\nМатеріали: legar.com.ua/blog · канал @legarukr\n\nЗахочете розібрати свою ситуацію — просто напишіть питання сюди, я відповім.");
      else await ASK[d.step](chat_id);
    }
    return NextResponse.json({ ok: true });
  }

  // Телефон
  if (d.step === "phone" && (contact || text)) {
    const phone = contact?.phone_number ?? text!.slice(0, 20);
    await finish(sb, chat_id, id, d, phone, contact?.first_name ?? firstName, username);
    return NextResponse.json({ ok: true });
  }

  // Місто текстом
  if (d.step === "city_text" && text) {
    d.city = text.slice(0, 60);
    d.step = nextStep("city_text");
    await saveSession(sb, chat_id, id, d, firstName);
    await ASK[d.step](chat_id);
    return NextResponse.json({ ok: true });
  }

  // Вільний текст → AI, потім повертаємо до сценарію
  if (text) {
    await tg("sendChatAction", { chat_id, action: "typing" });
    const answer = await aiReply(text, summarize(d));
    await say(chat_id, answer ?? "Зараз не можу відповісти — але адвокат-партнер НААУ розбере вашу ситуацію. Продовжимо?");
    if (d.step !== "done" && ASK[d.step]) await ASK[d.step](chat_id);
    else await say(chat_id, "Потрібна допомога адвоката? Натисніть /start — це швидко.");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
