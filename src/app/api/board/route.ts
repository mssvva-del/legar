import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Колонки дошки. Значення = status у БД. */
export const STAGES = ["new", "call", "consult", "service", "paid", "lost"] as const;

function authed(req: NextRequest): boolean {
  const pass = process.env.BOARD_PASSWORD;
  if (!pass) return false;
  return req.headers.get("x-board-pass") === pass;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const sb = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (sb as any)
      .from("leads")
      .select("id,name,phone,email,city,service,message,status,utm_source,utm_campaign,created_at")
      .neq("status", "draft")           // чернетки діалогу бота на дошку не показуємо
      .order("id", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ leads: data ?? [] });
  } catch (err) {
    console.error("[BOARD] get", err);
    return NextResponse.json({ error: "db" }, { status: 503 });
  }
}

/** Зміна статусу та/або дописування нотатки. */
export async function PATCH(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { id?: number; status?: string; note?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (body.status && !STAGES.includes(body.status as (typeof STAGES)[number]))
    return NextResponse.json({ error: "bad status" }, { status: 400 });

  try {
    const sb = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, unknown> = {};
    if (body.status) patch.status = body.status;

    if (body.note?.trim()) {
      // Окремої колонки для нотаток немає — дописуємо в message з міткою часу.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: cur } = await (sb as any).from("leads").select("message").eq("id", body.id).single();
      const stamp = new Date().toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      patch.message = `${cur?.message ?? ""}\n📝 ${stamp}: ${body.note.trim()}`.slice(0, 4000);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (sb as any).from("leads").update(patch).eq("id", body.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[BOARD] patch", err);
    return NextResponse.json({ error: "db" }, { status: 503 });
  }
}
