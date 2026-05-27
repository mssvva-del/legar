import type { Resend as ResendType } from "resend";

let _resend: ResendType | null = null;

function getResend(): ResendType | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    // Lazy import to avoid module-level crash when RESEND_API_KEY is absent
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Resend } = require("resend") as typeof import("resend");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.RESEND_FROM ?? "LEGAR <noreply@legar.com.ua>";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Send a transactional email via Resend.
 * Returns { success: true } or { success: false, error: string }.
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    // eslint-disable-next-line no-console
    console.warn("[LEGAR email] RESEND_API_KEY не встановлено. Email не надіслано:", payload.to, payload.subject);
    return { success: true }; // Graceful degradation in dev
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[LEGAR email] Resend error:", error);
      return { success: false, error: (error as { message?: string }).message ?? "Unknown error" };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    // eslint-disable-next-line no-console
    console.error("[LEGAR email] Unexpected error:", msg);
    return { success: false, error: msg };
  }
}
