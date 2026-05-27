const STEPS = [
  {
    number: "01",
    title: "Безкоштовна AI-діагностика",
    description:
      "Опишіть свою ситуацію за 5-10 хвилин. AI проаналізує і запропонує оптимальний алгоритм дій + рекомендує підходящий пакет послуг.",
    accent: false,
  },
  {
    number: "02",
    title: "Призначення адвоката-партнера",
    description:
      "На основі вашого міста, типу справи та терміновості ми підбираємо спеціалізованого адвоката НААУ. Ви бачите його фото, номер свідоцтва та досвід.",
    accent: false,
  },
  {
    number: "03",
    title: "Цифровий договір",
    description:
      "Договір про надання правової допомоги укладається онлайн. Оплата картою або через банк. Фіксована ціна без сюрпризів.",
    accent: false,
  },
  {
    number: "04",
    title: "Адвокат веде вашу справу",
    description:
      "Ви бачите статус справи в кабінеті в реальному часі. Документи, повідомлення, дзвінки — все в одному місці. Адвокат на зв'язку 24/7.",
    accent: true,
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-title"
      className="bg-white py-20 md:py-24"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-600)]">
            Процес
          </p>
          <h2
            id="how-title"
            className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[40px]"
          >
            Як працює LEGAR
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
            Від першого кліку до результату — все прозоро і під вашим контролем.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Horizontal connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden lg:block"
          >
            <div className="mx-auto h-px max-w-[860px] bg-gradient-to-r from-transparent via-[var(--color-bg-300)] to-transparent" />
            <div className="absolute left-1/2 top-1/2 inline-flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ink)]">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M3 8.5 L6.5 12 L13 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step) => (
              <li key={step.number} className="flex flex-col items-center text-center">
                <span
                  aria-hidden="true"
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full font-[family-name:var(--font-manrope)] text-[28px] font-extrabold ${
                    step.accent
                      ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                      : "bg-[var(--color-primary)] text-white"
                  }`}
                >
                  {step.number}
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-[20px] font-extrabold leading-tight text-[var(--color-ink)]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[260px] text-[15px] leading-relaxed text-[var(--color-ink)]/65">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
