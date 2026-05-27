import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sendMessageSchema = z.object({
  case_id: z.string().uuid(),
  body: z.string().min(1).max(4000),
});

/** GET /api/messages?case_id=xxx — get messages for a case */
export async function GET(req: NextRequest) {
  const caseId = req.nextUrl.searchParams.get("case_id");
  if (!caseId) {
    return NextResponse.json({ error: "case_id required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  // Verify user has access to case
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (serviceClient as any)
    .from("profiles").select("role").eq("id", user.id).single();

  const isAdmin = profile?.role === "admin" || profile?.role === "lawyer";

  if (!isAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: caseRow } = await (serviceClient as any)
      .from("cases").select("id").eq("id", caseId).eq("client_id", user.id).single();
    if (!caseRow) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (serviceClient as any)
    .from("messages")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [] });
}

/** POST /api/messages — send a message */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = sendMessageSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const serviceClient = createServiceClient();

  // Verify access to case
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (serviceClient as any)
    .from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.role === "lawyer";

  if (!isAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: caseRow } = await (serviceClient as any)
      .from("cases").select("id").eq("id", parsed.data.case_id).eq("client_id", user.id).single();
    if (!caseRow) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (serviceClient as any)
    .from("messages")
    .insert({
      case_id: parsed.data.case_id,
      sender_id: user.id,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data }, { status: 201 });
}
