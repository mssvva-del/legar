import type { SolutionBlock } from "@/lib/services-content";

interface SolutionSectionProps {
  solution: SolutionBlock;
}

export function SolutionSection({ solution }: SolutionSectionProps) {
  return (
    <section
      aria-labelledby="solution-heading"
      className="bg-[var(--color-bg-200)] py-16 md:py-20"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px]">
          <h2
            id="solution-heading"
            className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
          >
            {solution.heading}
          </h2>

          <div className="mt-6 space-y-4">
            {solution.paragraphs.map((p, i) => (
              <p key={i} className="text-[17px] leading-relaxed text-[var(--color-ink)]/75">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
