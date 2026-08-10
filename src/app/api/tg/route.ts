import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { aiReply } from "@/lib/tg-ai";
import {
  DOORS, SITUATIONS, WHEN, DONE, CITIES, CONSULTS,
  deadline, score, caseSummary,
  type Step, type QuizData,
} from "@/lib/tg-quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BOT = process.env.TELEGRAM_CLIENT_BOT_TOKEN;
const NOTIFY_BOT = process.env.TELEGRAM_BOT_TOKEN;
const NOTIFY_CHAT = process.env.TELEGRAM_CHAT_ID;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const PAY = { express: process.env.PAY_LINK_EXPRESS, full: process.env.PAY_LINK_FULL };

async function tg(method: string, body: Record<string, unknown>, token = BOT) {
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
  } catch (err) { console.error("[LEGAR TG]", method, err); }
}

const say = (chat_id: number, text: string, extra: Record<string, unknown> = {}) =>
  tg("sendMessage", { chat_id, text, parse_mode: "Markdown", disable_web_page_preview: true, ...extra });

const kb = (rows: [string, string][][]) =>
  ({ reply_markup: { inline_keyboard: rows.map((r) => r.map(([text, callback_data]) => ({ text, callback_data }))) } });

const phoneKb = { reply_markup: { keyboard: [[{ text: "📱 Поділитися номером", request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } };

// ── Питання ────────────────────────────────────────────────────────────────
const askDoor = (c: number) =>
  say(c, "Вітаю! Я AI-помічник *LEGAR* 🛡\n\nДопоможу розібратися з ТЦК, ВЛК, СЗЧ та бронюванням. Працюють адвокати-партнери НААУ.\n\n*З чого почнемо?*",
    kb([[["🔴 У мене вже є документ / проблема", "door:case"]], [["💬 Потрібна консультація юриста", "door:consult"]], [["❓ Просто питання", "door:info"]]]));

const askSituation = (c: number) =>
  say(c, "Яка саме ситуація?",
    kb([[["Штраф від ТЦК", "sit:shtraf"]], [["Повістка", "sit:povistka"]], [["Не згоден з ВЛК", "sit:vlk"]], [["СЗЧ (ст. 407)", "sit:szch"]], [["Бронювання / бізнес", "sit:bron"]], [["Інше", "sit:other"]]]));

const askWhen = (c: number) =>
  say(c, "Коли ви отримали документ? Від цього залежить строк на оскарження.",
    kb([[["Сьогодні або вчора", "whn:today"]], [["2–5 днів тому", "whn:d2_5"]], [["6–10 днів тому", "whn:d6_10"]], [["Більше 10 днів тому", "whn:d10p"]], [["Ще не отримав", "whn:not_yet"]]]));

const askPhoto = (c: number) =>
  say(c, "Надішліть *фото документа* (постанова, повістка, висновок) — адвокат подивиться його ще до дзвінка і одразу побачить підстави.\n\nЯкщо документа під рукою немає — натисніть кнопку.",
    kb([[["Документа зараз немає", "pht:skip"]]]));

const askDone = (c: number) =>
  say(c, "Що ви вже встигли зробити?",
    kb([[["Нічого не робив", "dn:nothing"]], [["Підписав документи", "dn:signed"]], [["Вже оплатив штраф", "dn:paid"]], [["Подавав скаргу сам", "dn:appealed"]]]));

const askCity = (c: number) =>
  say(c, "З якого ви міста?",
    kb([[["Київ", "cty:kyiv"], ["Львів", "cty:lviv"]], [["Дніпро", "cty:dnipro"], ["Харків", "cty:kharkiv"]], [["Одеса", "cty:odesa"], ["Інше", "cty:other"]]]));

const askConsult = (c: number) =>
  say(c, `Консультацію проводить адвокат-партнер НААУ. Два формати:\n\n*${CONSULTS.express.title} — ${CONSULTS.express.price} грн*\n${CONSULTS.express.desc}\n\n*${CONSULTS.full.title} — ${CONSULTS.full.price} грн*\n${CONSULTS.full.desc}\n\n💡 Вартість консультації *зараховується* у вартість послуги, якщо продовжите з нами.`,
    kb([[[`Експрес — ${CONSULTS.express.price} грн`, "cns:express"]], [[`Повна — ${CONSULTS.full.price} грн`, "cns:full"]]]));

const askPay = (c: number, kind: keyof typeof PAY) => {
  const o = CONSULTS[kind];
  const link = PAY[kind];
  const rows: [string, string][][] = [];
  if (link) rows.push([[`💳 Оплатити ${o.price} грн`, `pay:${kind}`]]);
  rows.push([["✅ Я оплатив(ла)", `paid:${kind}`]]);
  return say(c,
    link
      ? `*${o.title} — ${o.price} грн*\n${o.desc}\n\nОплатіть за посиланням, потім натисніть «Я оплатив» — і ми узгодимо час.\n\n${link}`
      : `*${o.title} — ${o.price} грн*\n${o.desc}\n\nЗалиште номер — менеджер надішле посилання на оплату і узгодить час дзвінка.`,
    link ? kb(rows) : phoneKb);
};

// ── Сесія: чернетка у таблиці leads (status='draft', phone='tg:<id>') ───────
const key = (id: number) => `tg:${id}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
async function load(sb: any, chat_id: number) {
  const { data } = await sb.from("leads").select("id, message").eq("phone", key(chat_id)).eq("status", "draft").maybeSingle();
  if (!data) return null;
  try { return { id: data.id as number, d: JSON.parse(data.message) as QuizData }; } catch { return null; }
}

async function save(sb: any, chat_id: number, id: number | null, d: QuizData, name?: string) {
  const row = { phone: key(chat_id), message: JSON.stringify(d), status: "draft", name: name || `TG ${chat_id}`, city: d.city ?? null, service: d.situation ?? null, utm_source: "telegram", utm_medium: "bot", utm_campaign: d.source ?? "tg" };
  if (id) await sb.from("leads").update(row).eq("id", id);
  else await sb.from("leads").insert(row);
}

/** Фінал: пишемо лід і будимо менеджера. */
async function handoff(sb: any, chat_id: number, id: number | null, d: QuizData, phone: string, name?: string, username?: string) {
  const s = score(d);
  const summary = caseSummary(d);
  // Одразу кладемо у правильну колонку дошки: обрав консультацію → consult, зібрав справу → service.
  const stage = d.door === "consult" ? "consult" : d.door === "case" ? "service" : "new";
  const row = { phone, name: name || username || `TG ${chat_id}`, city: d.city ?? null, service: d.situation ?? null, message: `[TG ${s.label}] ${summary}`, status: stage, utm_source: "telegram", utm_medium: "bot", utm_campaign: d.source ?? "tg" };
  if (id) await sb.from("leads").update(row).eq("id", id);
  else await sb.from("leads").insert(row);

  await tg("sendMessage", {
    chat_id: NOTIFY_CHAT,
    text: `${s.label}\n\n👤 ${row.name}  📞 ${phone}\nTG: @${username ?? "—"}\n\n${summary}`,
    disable_web_page_preview: true,
  }, NOTIFY_BOT);

  if (d.photoId) {
    await tg("sendPhoto", { chat_id: NOTIFY_CHAT, photo: d.photoId, caption: `Документ від ${row.name} (${phone})` }, NOTIFY_BOT);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
  const photo = u.message?.photo?.slice(-1)[0]?.file_id ?? u.message?.document?.file_id;

  const sb = createServiceClient();
  const sess = await load(sb, chat_id);
  const d: QuizData = sess?.d ?? { step: "door" };
  const id = sess?.id ?? null;
  const persist = () => save(sb, chat_id, id, d, firstName);

  // /start
  if (text?.startsWith("/start")) {
    const payload = text.split(" ")[1]?.trim();
    const fresh: QuizData = { step: "door", source: payload };
    if (payload && SITUATIONS[payload]) fresh.situation = SITUATIONS[payload];
    await save(sb, chat_id, id, fresh, firstName);
    await askDoor(chat_id);
    return NextResponse.json({ ok: true });
  }

  // Кнопки
  if (cb?.data) {
    await tg("answerCallbackQuery", { callback_query_id: cb.id });
    const [k, v] = String(cb.data).split(":");

    if (k === "door" && DOORS[v]) {
      d.door = v;
      if (v === "case") { d.step = d.situation ? "when" : "situation"; await persist(); await (d.situation ? askWhen : askSituation)(chat_id); }
      else if (v === "consult") { d.step = "consult_pick"; await persist(); await askConsult(chat_id); }
      else {
        d.step = "chat"; await persist();
        await say(chat_id, `Питайте — відповім по суті ТЦК, ВЛК, СЗЧ і мобілізації.\n\nЯкщо потрібен розбір саме вашої ситуації з юристом — це *${CONSULTS.express.title}, ${CONSULTS.express.price} грн* (${CONSULTS.express.desc.toLowerCase()})`,
          kb([[[`Хочу розбір за ${CONSULTS.express.price} грн`, "cns:express"]]]));
      }
    }
    else if (k === "sit" && SITUATIONS[v]) { d.situation = SITUATIONS[v]; d.step = "when"; await persist(); await askWhen(chat_id); }
    else if (k === "whn" && WHEN[v]) {
      d.when = v; d.step = "photo"; await persist();
      const dl = deadline(v);
      await say(chat_id, `${dl.urgent ? "⏳ " : ""}${dl.text}`);
      await askPhoto(chat_id);
    }
    else if (k === "pht") { d.hasPhoto = false; d.step = "done_before"; await persist(); await askDone(chat_id); }
    else if (k === "dn" && DONE[v]) { d.doneBefore = v; d.step = "city"; await persist(); await askCity(chat_id); }
    else if (k === "cty" && CITIES[v]) {
      d.city = CITIES[v]; d.step = "phone"; await persist();
      await say(chat_id, "Дякую, справу зібрано ✅\n\nЗалиште номер — адвокат-партнер НААУ вивчить ваші документи *до дзвінка* і скаже конкретні підстави та план.", phoneKb);
    }
    else if (k === "cns" && CONSULTS[v]) { d.door = "consult"; d.consult = v; d.step = "consult_pay"; await persist(); await askPay(chat_id, v as keyof typeof PAY); }
    else if (k === "pay") { await say(chat_id, `Посилання на оплату: ${PAY[v as keyof typeof PAY] ?? "менеджер надішле"}\n\nПісля оплати натисніть «Я оплатив».`); }
    else if (k === "paid") {
      d.paidClaimed = true; d.step = "consult_phone"; await persist();
      await say(chat_id, "Дякую! Залиште номер — менеджер перевірить оплату і узгодить час дзвінка з юристом.", phoneKb);
    }
    return NextResponse.json({ ok: true });
  }

  // Фото документа
  if (photo && (d.step === "photo" || d.door === "case")) {
    d.photoId = photo; d.hasPhoto = true; d.step = "done_before"; await persist();
    await say(chat_id, "Документ отримано ✅ Адвокат подивиться його перед дзвінком.");
    await askDone(chat_id);
    return NextResponse.json({ ok: true });
  }

  // Телефон
  if ((d.step === "phone" || d.step === "consult_phone") && (contact || (text && /\d{7,}/.test(text)))) {
    const phone = contact?.phone_number ?? text!.replace(/[^\d+]/g, "").slice(0, 20);
    // Сесію не переносимо: рядок став лідом. Наступне повідомлення почне новий діалог.
    await handoff(sb, chat_id, id, d, phone, contact?.first_name ?? firstName, username);
    await say(chat_id,
      d.paidClaimed
        ? "Готово ✅ Менеджер підтвердить оплату і зателефонує найближчим часом."
        : "Готово ✅ Адвокат вивчить справу і менеджер зателефонує найближчим часом.\n\nМожете поставити мені будь-яке питання — відповім, поки чекаєте.",
      { reply_markup: { remove_keyboard: true } });
    return NextResponse.json({ ok: true });
  }

  // Вільний текст → AI
  if (text) {
    await tg("sendChatAction", { chat_id, action: "typing" });
    const answer = await aiReply(text, caseSummary(d));
    await say(chat_id, answer ?? "Це питання краще розібрати з юристом — він подивиться саме вашу ситуацію.");
    if (d.step === "chat" || d.step === "door") {
      await say(chat_id, `Хочете, щоб юрист розібрав саме ваш випадок? *${CONSULTS.express.title} — ${CONSULTS.express.price} грн*, дзвінок 15–20 хв.`,
        kb([[[`Так, розібрати за ${CONSULTS.express.price} грн`, "cns:express"]], [["У мене є документ — зібрати справу", "door:case"]]]));
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
