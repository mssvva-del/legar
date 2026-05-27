import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/emails/send";
import { welcomeTemplate } from "@/lib/emails/templates/welcome";

export const dynamic = "force-dynamic";

/**
 * /auth/callback — Supabase Auth callback handler.
 * Handles: magic link, email confirmation, OAuth redirects.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/cabinet";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle error from Supabase
  if (error) {
    console.error("[Auth Callback] Error:", error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // Send welcome email on first-time email confirmation
      // (only when ?next=/cabinet which is the signup confirmation redirect)
      if (next === "/cabinet" && sessionData?.user) {
        const user = sessionData.user;
        const isNewUser = user.created_at === user.last_sign_in_at || !user.last_sign_in_at;
        if (isNewUser && user.email) {
          const name = (user.user_metadata?.full_name as string | undefined) ?? "Клієнт";
          const template = welcomeTemplate({ name, email: user.email });
          await sendEmail({ to: user.email, ...template }).catch(() => {/* non-blocking */});
        }
      }
      // Successful auth — redirect to destination
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[Auth Callback] Exchange error:", exchangeError);
  }

  // Fallback — redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
