import type { ProblemBlock } from "@/lib/services-content";

interface ProblemSectionProps {
  problem: ProblemBlock;
}

export function ProblemSection({ problem }: ProblemSectionProps) {
  return (
    <section
      aria-labelledby="problem-heading"
      className="bg-[var(--color-ink)] py-16 md:py-20"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[860px]">
          <h2
            id="problem-heading"
            className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-white md:text-[36px]"
          >
            {problem.heading}
          </h2>

          <div className="mt-6 space-y-4">
            {problem.paragraphs.map((p, i) => (
              <p key={i} className="text-[16px] leading-relaxed text-white/70">
                {p}
              </p>
            ))}
          </div>

          {/* Stats */}
          {problem.stats.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {problem.stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[12px] border border-white/10 bg-white/5 p-6 text-center"
                >
                  <p className="font-[family-name:var(--font-manrope)] text-[36px] font-extrabold text-[var(--color-accent)]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
