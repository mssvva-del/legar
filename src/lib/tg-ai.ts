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

/** Anthropic, якщо є ключ; інакше Groq. Обидва — OpenAI-сумісні за формою відповіді. */
export async function aiReply(userText: string, context?: string): Promise<string | null> {
  const prompt = context ? `[Що вже відомо: ${context}]\n\n${userText}` : userText;
  const anthropic = process.env.ANTHROPIC_API_KEY;
  const groq = process.env.GROQ_API_KEY;

  const cfg: {
    url: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
    pick: (d: Record<string, unknown>) => string | undefined;
  } | null = anthropic
    ? {
        url: "https://api.anthropic.com/v1/messages",
        headers: { "content-type": "application/json", "x-api-key": anthropic, "anthropic-version": "2023-06-01" },
        body: { model: "claude-haiku-4-5-20251001", max_tokens: 400, system: SYSTEM, messages: [{ role: "user", content: prompt }] },
        pick: (d: Record<string, unknown>) =>
          (d.content as { type: string; text?: string }[] | undefined)?.find((c) => c.type === "text")?.text,
      }
    : groq
      ? {
          url: "https://api.groq.com/openai/v1/chat/completions",
          headers: { "content-type": "application/json", Authorization: `Bearer ${groq}` },
          body: { model: "llama-3.3-70b-versatile", max_tokens: 400, messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }] },
          pick: (d: Record<string, unknown>) =>
            (d.choices as { message?: { content?: string } }[] | undefined)?.[0]?.message?.content,
        }
      : null;

  if (!cfg) return null;

  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: cfg.headers,
      body: JSON.stringify(cfg.body),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.error("[LEGAR AI]", res.status, await res.text().catch(() => ""));
      return null;
    }
    return cfg.pick((await res.json()) as Record<string, unknown>)?.trim() ?? null;
  } catch (err) {
    console.error("[LEGAR AI]", err);
    return null;
  }
}
