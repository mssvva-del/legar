export type LawyerApplicationReceivedData = {
  name: string;
  applicationId: number;
};

export function lawyerApplicationReceivedTemplate(data: LawyerApplicationReceivedData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://legar.com.ua";
  return {
    subject: `LEGAR: Вашу заявку адвоката #${data.applicationId} отримано`,
    html: `<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
<tr><td style="background:#0A0F1F;padding:32px 40px;text-align:center;">
  <div style="font-size:24px;font-weight:800;color:#ffffff;">LEGAR</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:4px;">Партнерська мережа адвокатів</div>
</td></tr>
<tr><td style="padding:40px;">
  <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#0A0F1F;">Дякуємо за заявку, ${data.name}!</h1>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4B5563;">
    Ми отримали вашу заявку на вступ до партнерської мережі LEGAR (№${data.applicationId}).
  </p>
  <div style="background:#f4f6fb;border-radius:12px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0A0F1F;text-transform:uppercase;letter-spacing:0.5px;">Що відбувається далі?</p>
    <ol style="margin:0;padding-left:20px;font-size:14px;line-height:2;color:#4B5563;">
      <li>Ми перевіримо ваше свідоцтво НААУ (1-2 робочих дні)</li>
      <li>Зв'яжемося для уточнення деталей (телефон або email)</li>
      <li>Підпишемо партнерський договір</li>
      <li>Ви отримаєте доступ до справ від клієнтів LEGAR</li>
    </ol>
  </div>
  <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
    Маєте питання? Пишіть: <a href="mailto:partners@legar.com.ua" style="color:#1B4DFF;">partners@legar.com.ua</a>
  </p>
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
