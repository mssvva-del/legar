export type CaseStatusUpdateData = {
  name: string;
  serviceTitle: string;
  oldStatus: string;
  newStatus: string;
  caseId: string;
};

const STATUS_UA: Record<string, string> = {
  lead: "Нова заявка",
  contract: "Підписання договору",
  paid: "Сплачено",
  in_progress: "В роботі",
  closed: "Закрито",
  refunded: "Повернення",
};

const STATUS_COLORS: Record<string, string> = {
  lead: "#d97706",
  contract: "#2563eb",
  paid: "#7c3aed",
  in_progress: "#1B4DFF",
  closed: "#16a34a",
  refunded: "#6b7280",
};

export function caseStatusUpdateTemplate(data: CaseStatusUpdateData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://legar.com.ua";
  const statusLabel = STATUS_UA[data.newStatus] ?? data.newStatus;
  const statusColor = STATUS_COLORS[data.newStatus] ?? "#1B4DFF";

  return {
    subject: `LEGAR: Статус справи «${data.serviceTitle}» змінено`,
    html: `<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
<tr><td style="background:#1B4DFF;padding:32px 40px;text-align:center;">
  <div style="font-size:24px;font-weight:800;color:#ffffff;">LEGAR</div>
</td></tr>
<tr><td style="padding:40px;">
  <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0A0F1F;">Статус справи оновлено</h1>
  <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4B5563;">
    <strong>${data.name}</strong>, статус вашої справи «<strong>${data.serviceTitle}</strong>» змінився.
  </p>
  <div style="display:flex;align-items:center;gap:16px;background:#f4f6fb;border-radius:12px;padding:20px;margin-bottom:24px;">
    <div style="text-align:center;flex:1;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#9CA3AF;font-weight:600;">Було</p>
      <span style="font-size:13px;font-weight:700;color:#6B7280;">${STATUS_UA[data.oldStatus] ?? data.oldStatus}</span>
    </div>
    <div style="color:#9CA3AF;font-size:20px;">→</div>
    <div style="text-align:center;flex:1;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#9CA3AF;font-weight:600;">Стало</p>
      <span style="font-size:13px;font-weight:700;color:${statusColor};">${statusLabel}</span>
    </div>
  </div>
  <div style="text-align:center;margin:24px 0;">
    <a href="${siteUrl}/cabinet/spravy"
       style="display:inline-block;background:#1B4DFF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:12px;">
      Переглянути справу →
    </a>
  </div>
</td></tr>
<tr><td style="background:#f4f6fb;padding:24px 40px;text-align:center;border-top:1px solid #ebeff8;">
  <p style="margin:0;font-size:12px;color:#9CA3AF;">© 2025 LEGAR · <a href="${siteUrl}/legal/pryvatnist" style="color:#9CA3AF;">Конфіденційність</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
  };
}
