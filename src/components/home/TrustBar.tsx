const SIGNALS = [
  { value: "0 800", label: "Безкоштовна лінія 24/7" },
  { value: "5 хв", label: "AI-діагностика" },
  { value: "НААУ", label: "Адвокати-партнери" },
  { value: "5+ міст", label: "Київ, Львів, Дніпро, Харків, Одеса" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Ключові показники LEGAR"
      className="bg-[var(--color-bg-200)] py-8"
    >
      <div className="container-legar">
        <ul className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:divide-x md:divide-[var(--color-bg-300)]">
          {SIGNALS.map((s, i) => (
            <li
              key={s.label}
              className={`flex flex-col items-center text-center md:px-4 ${
                i === 0 ? "md:items-center" : ""
              }`}
            >
              <span className="font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-none text-[var(--color-ink)]">
                {s.value}
              </span>
              <span className="mt-2 text-[14px] font-medium text-[var(--color-ink)]/65">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
