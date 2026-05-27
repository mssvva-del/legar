import type { ForWhomScenario } from "@/lib/services-content";

interface ForWhomSectionProps {
  scenarios: ForWhomScenario[];
}

export function ForWhomSection({ scenarios }: ForWhomSectionProps) {
  return (
    <section aria-labelledby="for-whom-heading" className="py-16 md:py-20">
      <div className="container-legar">
        <h2
          id="for-whom-heading"
          className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
        >
          Для кого ця послуга
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6"
            >
              <span className="flex-shrink-0 text-[32px] leading-none" aria-hidden="true">
                {scenario.icon}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-manrope)] text-[16px] font-bold text-[var(--color-ink)]">
                  {scenario.title}
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink)]/65">
                  {scenario.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
