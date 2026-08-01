/**
 * LEGAR — AI-відповідь на вільний текст у Telegram-боті.
 * Claude Haiku: коротка юридично-коректна відповідь + м'яке повернення до заявки.
 */

const SYSTEM = `Ти — помічник української юридичної платформи LEGAR (legar.com.ua).
Тема: ТЦК, ВЛК, СЗЧ (ст. 407 ККУ), мобілізація, відстрочки, бронювання, права військових і їхніх родин.

НАШІ ПОСЛУГИ (називай ціни, якщо питають про вартість):
- Оцінка ситуації адвокатом — безкоштовно
- Консультація адвоката (до 30 хв, план дій) — 1 200 грн
- Антиштраф ТЦК під ключ (скарга + суд) — від 8 000 грн
- Супровід у ТЦК — від 5 000 грн
- Оскарження висновку ВЛК — від 14 000 грн
- Захист по СЗЧ (ст. 407) — від 30 000 грн
Роботу виконують адвокати-партнери, члени НААУ.

ФОРМАТ (суворо):
- Максимум 3 речення. Без списків, без заголовків, без абзаців.
- Виключно українська мова. Жодних російських слів і кальок.
- Останнє речення — заклик залишити заявку тут у боті.

ЗМІСТ:
- Радь лише законні дії: перевірити документ, зібрати докази, дотримати строки, оскаржити в установленому порядку.
- НІКОЛИ не радь робити це самостійно чи «без адвоката» і не кажи, що можна впоратися безкоштовно — наша цінність саме в супроводі адвоката.
- Не обіцяй результат справи, не називай відсотків успіху.
- Не вигадуй пільги, статті, строки і категорії. Не знаєш точно — скажи, що адвокат перевірить за документами.
- Ти не замінюєш адвоката: коротко орієнтуєш і ведеш до заявки.

Тон: спокійний, людяний, без канцеляриту. Людина у стресі — спершу заспокой одним реченням.`;

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
        // Sonnet: haiku ламав українську (чужі символи, кальки) — для юр-теми неприйнятно.
        body: { model: "claude-sonnet-5", max_tokens: 300, system: SYSTEM, messages: [{ role: "user", content: prompt }] },
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
