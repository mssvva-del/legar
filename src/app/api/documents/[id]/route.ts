import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** GET /api/documents/[id] — get signed download URL */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: doc } = await (serviceClient as any)
    .from("documents")
    .select("storage_path, file_name, case_id")
    .eq("id", id)
    .single();

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Verify user has access (owns the case)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: caseRow } = await (serviceClient as any)
    .from("cases")
    .select("id")
    .eq("id", doc.case_id)
    .eq("client_id", user.id)
    .single();

  if (!caseRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Generate signed URL (1 hour)
  const { data: signed, error } = await serviceClient.storage
    .from("documents")
    .createSignedUrl(doc.storage_path, 3600);

  if (error || !signed) {
    return NextResponse.json({ error: "Could not generate URL" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl, fileName: doc.file_name });
}

/** DELETE /api/documents/[id] — delete document */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: doc } = await (serviceClient as any)
    .from("documents")
    .select("storage_path, case_id")
    .eq("id", id)
    .single();

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Verify ownership
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: caseRow } = await (serviceClient as any)
    .from("cases")
    .select("id")
    .eq("id", doc.case_id)
    .eq("client_id", user.id)
    .single();

  if (!caseRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete from storage
  await serviceClient.storage.from("documents").remove([doc.storage_path]);

  // Delete record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (serviceClient as any)
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
