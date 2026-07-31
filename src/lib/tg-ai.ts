/**
 * LEGAR — AI-відповідь на вільний текст у Telegram-боті.
 * Claude Haiku: коротка юридично-коректна відповідь + м'яке повернення до заявки.
 */

const SYSTEM = `Ти — помічник української юридичної платформи LEGAR (legar.com.ua).
Спеціалізація: ТЦК, ВЛК, СЗЧ (ст. 407 ККУ), мобілізація, відстрочки, бронювання, права військових і їхніх родин.

ПРАВИЛА (порушувати не можна):
- Відповідай українською, коротко: 2–4 речення, без води.
- НІКОЛИ не гарантуй результат справи і не називай точних відсотків успіху.
- НЕ радь ухилятися від закону, «сховатися від ТЦК» чи «уникнути мобілізації». Тільки законні дії: «оскаржити законно», «знати свої права», «діяти в межах закону».
- Не вигадуй номери статей, строки і суми, якщо не впевнений. Краще сказати, що це уточнить адвокат.
- Ти НЕ адвокат і не даєш індивідуальної правової консультації — ти пояснюєш загальні речі й скеровуєш до адвоката-партнера НААУ.
- Наприкінці 1 короткою фразою поверни людину до дії: залишити заявку тут у боті, щоб адвокат розібрав ситуацію.

Тон: спокійний, людяний, без канцеляриту. Людина зазвичай у стресі.`;

export async function aiReply(userText: string, context?: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: context ? `[Що вже відомо: ${context}]\n\n${userText}` : userText,
          },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      console.error("[LEGAR AI]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    return data.content?.find((c) => c.type === "text")?.text?.trim() ?? null;
  } catch (err) {
    console.error("[LEGAR AI]", err);
    return null;
  }
}
