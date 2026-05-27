import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/messages/[id]/read — mark message as read */
export async function PATCH(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: msg } = await (serviceClient as any)
    .from("messages")
    .select("case_id, sender_id")
    .eq("id", id)
    .single();

  if (!msg) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Can only mark as read if you are the recipient (not the sender)
  if (msg.sender_id === user.id) {
    return NextResponse.json({ error: "Cannot mark own message as read" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (serviceClient as any)
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
