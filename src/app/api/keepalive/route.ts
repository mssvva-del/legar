import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Пінг для Supabase free-tier: проект засинає після 7 днів без запитів,
 * і тоді бот втрачає стан діалогу. Cron смикає раз на добу (vercel.json).
 */
export async function GET() {
  try {
    const sb = createServiceClient();
    const { error } = await sb.from("leads").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true, db: "awake" });
  } catch (err) {
    console.error("[LEGAR keepalive]", err);
    return NextResponse.json({ ok: false, db: "unreachable" }, { status: 503 });
  }
}
