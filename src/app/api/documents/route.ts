import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/documents — list documents for the authenticated user */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  // Get user's case ids
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: cases } = await (serviceClient as any)
    .from("cases")
    .select("id")
    .eq("client_id", user.id);

  const caseIds = (cases ?? []).map((c: { id: string }) => c.id);
  if (caseIds.length === 0) {
    return NextResponse.json({ documents: [] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (serviceClient as any)
    .from("documents")
    .select("*")
    .in("case_id", caseIds)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data ?? [] });
}

/** POST /api/documents — record uploaded document (metadata) */
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

  const body = json as {
    case_id?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    storage_path?: string;
  };

  if (!body.case_id || !body.file_name || !body.storage_path) {
    return NextResponse.json({ error: "case_id, file_name, storage_path required" }, { status: 422 });
  }

  const serviceClient = createServiceClient();

  // Verify case belongs to user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: caseRow } = await (serviceClient as any)
    .from("cases")
    .select("id")
    .eq("id", body.case_id)
    .eq("client_id", user.id)
    .single();

  if (!caseRow) {
    return NextResponse.json({ error: "Case not found or unauthorized" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (serviceClient as any)
    .from("documents")
    .insert({
      case_id: body.case_id,
      uploaded_by: user.id,
      file_name: body.file_name,
      file_size: body.file_size ?? null,
      file_type: body.file_type ?? null,
      storage_path: body.storage_path,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data }, { status: 201 });
}
