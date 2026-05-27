import { Quote } from "lucide-react";
import type { CaseStory } from "@/lib/services-content";

interface CasesGridProps {
  cases: CaseStory[];
}

export function CasesGrid({ cases }: CasesGridProps) {
  return (
    <section aria-labelledby="cases-heading" className="py-16 md:py-20">
      <div className="container-legar">
        <h2
          id="cases-heading"
          className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
        >
          Реальні справи
        </h2>
        <p className="mt-3 text-[15px] text-[var(--color-ink)]/55">
          Всі деталі анонімізовані за бажанням клієнтів.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cases.map((story) => (
            <article
              key={story.id}
              className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <Quote
                  className="h-6 w-6 flex-shrink-0 text-[var(--color-primary)]/30"
                  aria-hidden="true"
                />
                <span className="rounded-full bg-[var(--color-bg-200)] px-2.5 py-0.5 text-[12px] font-medium text-[var(--color-ink)]/55">
                  {story.tag}
                </span>
              </div>

              <p className="mt-4 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/70">
                {story.summary}
              </p>

              <div className="mt-5 rounded-[8px] bg-[var(--color-success)]/8 border border-[var(--color-success)]/20 p-4">
                <p className="text-[13px] font-semibold text-[var(--color-success)]">
                  Результат
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink)]/70">
                  {story.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
