import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { sendEmail } from "@/lib/emails/send";
import { caseStatusUpdateTemplate } from "@/lib/emails/templates/case-status-update";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["lead", "contract", "paid", "in_progress", "closed", "refunded"] as const;

const patchCaseSchema = z.object({
  status: z.enum(VALID_STATUSES).optional(),
  price_uah: z.number().min(0).optional(),
  lawyer_id: z.string().uuid().optional(),
  description: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/cases/[id] — update case (admin/lawyer only) */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin/lawyer role
  const serviceClient = createServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (serviceClient as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "lawyer"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchCaseSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  // Fetch current case to detect status change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: currentCase } = await (serviceClient as any)
    .from("cases")
    .select("status, service_title, client_id")
    .eq("id", id)
    .single();

  if (!currentCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (serviceClient as any)
    .from("cases")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email notification on status change
  if (parsed.data.status && parsed.data.status !== currentCase.status) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: clientProfile } = await (serviceClient as any)
      .from("profiles")
      .select("full_name")
      .eq("id", currentCase.client_id)
      .single();

    const { data: authUser } = await serviceClient.auth.admin.getUserById(currentCase.client_id);
    const clientEmail = authUser?.user?.email;

    if (clientEmail) {
      const template = caseStatusUpdateTemplate({
        name: clientProfile?.full_name ?? "Клієнт",
        serviceTitle: currentCase.service_title,
        oldStatus: currentCase.status,
        newStatus: parsed.data.status,
        caseId: id,
      });
      await sendEmail({ to: clientEmail, ...template });
    }
  }

  return NextResponse.json({ case: data });
}
