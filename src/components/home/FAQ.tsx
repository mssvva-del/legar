"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Чи є LEGAR адвокатським об'єднанням?",
    a: "Ні. LEGAR — це інформаційно-консультаційна платформа, яка з'єднує клієнтів з незалежними адвокатами-партнерами НААУ. Договір про надання правової допомоги ви укладаєте безпосередньо з адвокатом, який має чинне свідоцтво НААУ. LEGAR забезпечує технічну інфраструктуру, AI-діагностику та координацію.",
  },
  {
    q: "Скільки коштує AI-діагностика?",
    a: "Базова AI-діагностика безкоштовна — 5 хвилин, попередня класифікація вашої ситуації та рекомендації. Розширена AI-діагностика з персональним PDF-звітом, покроковим алгоритмом дій та аналізом ризиків коштує 1 200 грн і триває до 10 хвилин.",
  },
  {
    q: "Чи можу я викликати адвоката вночі?",
    a: "Так. Гаряча лінія 0 800 357 288 працює цілодобово, без вихідних. Нічна консультація (22:00–08:00) коштує 800 грн / 20 хвилин. Виїзд адвоката на ТЦК у будь-який час — 7 500 грн. Виїзд на затримання поліцією — 10 000 грн. Повний пакет SOS 24/7 з пріоритетним реагуванням — 24 000 грн на місяць.",
  },
  {
    q: "Як ви обираєте адвокатів?",
    a: "Ми працюємо лише з адвокатами, які: (1) мають чинне свідоцтво НААУ; (2) спеціалізуються на військовому та/або кримінальному праві; (3) мають підтверджений досвід (мінімум 5 успішних справ у профільній категорії); (4) пройшли нашу внутрішню верифікацію кваліфікації та репутації. На сторінці адвоката ви бачите його фото, номер свідоцтва НААУ та основні кейси.",
  },
  {
    q: "Як оплатити послугу?",
    a: "На сайті ви можете залишити заявку та отримати рахунок. Оплата приймається картою (Visa/Mastercard), Apple Pay/Google Pay, через інтернет-банкінг. Після оплати ви отримуєте чек на email і доступ до особистого кабінету, де відображається статус справи у реальному часі.",
  },
  {
    q: "Що буде, якщо результат мене не влаштує?",
    a: "По кожному пакету послуг ми надаємо чіткі критерії виконання. Якщо адвокат-партнер не виконав зобов'язань за договором, ви можете звернутися до Адміністрації LEGAR із претензією — ми переглянемо ситуацію і, за потреби, забезпечимо повернення коштів або переадресацію до іншого адвоката-партнера. Деталі у Договорі публічної оферти.",
  },
  {
    q: "Чи можна замовити послугу, якщо я зараз за кордоном?",
    a: "Так. Усі послуги, окрім фізичного виїзду адвоката, доступні дистанційно — консультація, AI-діагностика, аналіз документів ВЛК, оскарження рішень, підготовка стратегії захисту. Договір укладається онлайн з електронним підписом. Адвокат-партнер може представляти ваші інтереси в Україні за довіреністю.",
  },
  {
    q: "Як ви захищаєте мої персональні дані?",
    a: "Ми працюємо відповідно до Закону України «Про захист персональних даних» та GDPR. Усі дані передаються через шифроване з'єднання (TLS 1.3), зберігаються в захищеній інфраструктурі (Supabase) з обмеженим доступом через Row-Level Security. Адвокат-партнер бачить лише дані власних клієнтів. Деталі — у Політиці конфіденційності.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="faq-title"
      className="bg-[var(--color-bg-200)] py-20 md:py-24"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-600)]">
            Часті питання
          </p>
          <h2
            id="faq-title"
            className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[40px]"
          >
            Відповіді на типові запитання
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
            Не знайшли відповідь? Зателефонуйте 0 800 357 288 або напишіть у{" "}
            <Link
              href={"/kontakty" as const}
              className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
            >
              Telegram
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-[880px] flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-button-${i}`;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-[12px] border border-[var(--color-bg-300)] bg-white transition-shadow hover:shadow-sm"
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-100)] md:px-6 md:py-5 md:text-[17px]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-[var(--color-primary)] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  hidden={!isOpen}
                  className="px-5 pb-5 text-[15px] leading-relaxed text-[var(--color-ink)]/75 md:px-6 md:pb-6 md:text-[16px]"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
