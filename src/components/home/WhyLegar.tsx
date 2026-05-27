import { Monitor, Tag, ShieldCheck, PhoneCall } from "lucide-react";

const USPS = [
  {
    icon: Monitor,
    title: "Цифрова інфраструктура з першого дня",
    description:
      "Особистий кабінет, статус справи в реальному часі, чат із адвокатом, документи онлайн. Жодних дзвінків у робочий час і годинного очікування. Все керується з телефону.",
  },
  {
    icon: Tag,
    title: "Прозорі фіксовані ціни",
    description:
      "Ми публікуємо ціни відкрито на сайті. Жодних «індивідуальних розрахунків» пост-фактум. Ви бачите вартість пакету ще до того, як залишаєте заявку. Гарантуємо: підсумкова ціна не зміниться.",
  },
  {
    icon: ShieldCheck,
    title: "Адвокати-партнери НААУ з підтвердженою спеціалізацією",
    description:
      "Працюємо лише з адвокатами, які мають чинне свідоцтво НААУ та підтверджений досвід у військових/кримінальних справах. Фото, номер свідоцтва та портфоліо адвоката ви бачите перед укладенням договору.",
  },
  {
    icon: PhoneCall,
    title: "SOS 24/7 з фіксованою ціною виїзду",
    description:
      "Затримали о 3-й ночі? Гаряча лінія 0 800 357 288 працює цілодобово. Виїзд адвоката на ТЦК — 7 500 грн, на затримання поліцією — 10 000 грн. Ціни фіксовані. Жодних «договорим на місці».",
  },
];

export function WhyLegar() {
  return (
    <section
      aria-labelledby="why-title"
      className="bg-[var(--color-bg-300)] py-20 md:py-24"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-600)]">
            Чому саме ми
          </p>
          <h2
            id="why-title"
            className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[40px]"
          >
            Що відрізняє LEGAR від класичних юрфірм
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {USPS.map(({ icon: Icon, ...usp }) => (
            <article
              key={usp.title}
              className="rounded-[var(--radius-card)] bg-white p-7 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-[22px] font-extrabold leading-tight text-[var(--color-ink)]">
                {usp.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink)]/70">
                {usp.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
