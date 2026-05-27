export type WelcomeData = {
  name: string;
  email: string;
};

export function welcomeTemplate(data: WelcomeData): { subject: string; html: string } {
  return {
    subject: "Ласкаво просимо до LEGAR — ваш юридичний щит",
    html: `<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ласкаво просимо</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">

<!-- Header -->
<tr><td style="background:#1B4DFF;padding:32px 40px;text-align:center;">
  <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">LEGAR</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;">Юридичний щит України</div>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px;">
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0A0F1F;">Вітаємо, ${data.name}!</h1>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4B5563;">
    Ваш акаунт LEGAR успішно створено. Тепер ви маєте доступ до особистого кабінету, де зможете:
  </p>
  <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#4B5563;">
    <li>Відстежувати статус ваших справ</li>
    <li>Завантажувати та зберігати документи</li>
    <li>Спілкуватися з адвокатом у чаті</li>
    <li>Отримувати юридичні консультації</li>
  </ul>
  <div style="text-align:center;margin:32px 0;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legar.com.ua'}/cabinet"
       style="display:inline-block;background:#1B4DFF;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;">
      Перейти до кабінету →
    </a>
  </div>
  <p style="margin:0;font-size:14px;line-height:1.6;color:#9CA3AF;">
    Якщо вам потрібна допомога — зверніться на гарячу лінію 0 800 357 288 (безкоштовно)
    або напишіть на <a href="mailto:mail@legar.com.ua" style="color:#1B4DFF;">mail@legar.com.ua</a>
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f4f6fb;padding:24px 40px;text-align:center;border-top:1px solid #ebeff8;">
  <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
    © 2025 LEGAR. ТОВ «ЛЕГАР ПЛЮС», код ЄДРПОУ 45123456.<br>
    Юридичні послуги надають адвокати-партнери НААУ.<br>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legar.com.ua'}/legal/pryvatnist" style="color:#9CA3AF;">Політика конфіденційності</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  };
}
