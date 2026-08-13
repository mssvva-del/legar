/** Telegram API для HQ-бота. Окремий бот від клієнтського — інший токен. */

const TOKEN = process.env.TELEGRAM_HQ_BOT_TOKEN;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function api(method: string, body: Record<string, unknown>): Promise<any> {
  if (!TOKEN) { console.error("[HQ] TELEGRAM_HQ_BOT_TOKEN не задано"); return null; }
  try {
    const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!j.ok) console.error("[HQ tg]", method, j.description);
    return j;
  } catch (err) {
    console.error("[HQ tg]", method, err);
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** HTML-екранування: у назвах задач трапляються & і < */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const send = (chat_id: number, text: string, extra: Record<string, unknown> = {}) =>
  api("sendMessage", { chat_id, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });

export const edit = (chat_id: number, message_id: number, text: string, extra: Record<string, unknown> = {}) =>
  api("editMessageText", { chat_id, message_id, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });

export const answer = (callback_query_id: string, text?: string) =>
  api("answerCallbackQuery", { callback_query_id, ...(text ? { text } : {}) });

/** Клавіатура: масив рядків, у рядку — пари [підпис, callback_data]. */
export const kb = (rows: [string, string][][]) =>
  ({ reply_markup: { inline_keyboard: rows.map((r) => r.map(([text, callback_data]) => ({ text, callback_data }))) } });

export const noKb = { reply_markup: { inline_keyboard: [] } };

/** Пересилає вкладення (фото/документ) отримувачу. */
export async function sendAttachment(
  chat_id: number, a: { type: string; file_id: string; caption?: string },
) {
  const method = a.type === "photo" ? "sendPhoto"
    : a.type === "voice" ? "sendVoice"
      : a.type === "video" ? "sendVideo"
        : a.type === "audio" ? "sendAudio"
          : "sendDocument";
  const field = a.type === "photo" ? "photo"
    : a.type === "voice" ? "voice"
      : a.type === "video" ? "video"
        : a.type === "audio" ? "audio"
          : "document";
  return api(method, { chat_id, [field]: a.file_id, ...(a.caption ? { caption: a.caption } : {}) });
}
