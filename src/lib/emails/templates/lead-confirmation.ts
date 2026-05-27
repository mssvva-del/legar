export type LeadConfirmationData = {
  name: string;
  service?: string;
  leadId: number;
};

export function leadConfirmationTemplate(data: LeadConfirmationData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://legar.com.ua";
  return {
    subject: `LEGAR: Вашу заявку #${data.leadId} прийнято`,
    html: `<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Заявку прийнято</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
<tr><td style="background:#1B4DFF;padding:32px 40px;text-align:center;">
  <div style="font-size:24px;font-weight:800;color:#ffffff;">LEGAR</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;">Юридичний щит України</div>
</td></tr>
<tr><td style="padding:40px;">
  <div style="width:48px;height:48px;background:#dcfce7;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:24px;">✅</div>
  <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#0A0F1F;">Заявку прийнято!</h1>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4B5563;">
    Дякуємо, <strong>${data.name}</strong>! Вашу заявку №${data.leadId}${data.service ? ` на послугу «${data.service}»` : ""} отримано.
  </p>
  <div style="background:#f4f6fb;border-radius:12px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0A0F1F;text-transform:uppercase;letter-spacing:0.5px;">Що далі?</p>
    <ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#4B5563;">
      <li>Наш менеджер зв'яжеться з вами протягом <strong>30 хвилин</strong> (або наступного робочого дня)</li>
      <li>Проведемо безкоштовну первинну консультацію</li>
      <li>Підберемо відповідного адвоката-партнера</li>
    </ol>
  </div>
  <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6B7280;">
    Терміново? Зателефонуйте: <strong><a href="tel:0800357288" style="color:#1B4DFF;text-decoration:none;">0 800 357 288</a></strong> (безкоштовно)
  </p>
  <div style="text-align:center;">
    <a href="${siteUrl}/cabinet"
       style="display:inline-block;background:#1B4DFF;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:12px;">
      Особистий кабінет →
    </a>
  </div>
</td></tr>
<tr><td style="background:#f4f6fb;padding:24px 40px;text-align:center;border-top:1px solid #ebeff8;">
  <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
    © 2025 LEGAR · <a href="${siteUrl}/legal/pryvatnist" style="color:#9CA3AF;">Конфіденційність</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
  };
}
