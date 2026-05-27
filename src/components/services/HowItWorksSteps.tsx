import { Clock } from "lucide-react";
import type { HowItWorksStep } from "@/lib/services-content";

interface HowItWorksStepsProps {
  steps: HowItWorksStep[];
}

export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  return (
    <section
      aria-labelledby="how-works-heading"
      className="bg-[var(--color-bg-200)] py-16 md:py-20"
    >
      <div className="container-legar">
        <h2
          id="how-works-heading"
          className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
        >
          Як це працює
        </h2>

        <div className="mt-10 space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-6">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="absolute left-[20px] top-[44px] h-full w-[2px] bg-[var(--color-bg-300)]"
                  aria-hidden="true"
                />
              )}

              {/* Step number */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--color-primary)] font-[family-name:var(--font-manrope)] text-[15px] font-extrabold text-white">
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <div className="pb-10">
                <h3 className="font-[family-name:var(--font-manrope)] text-[18px] font-bold text-[var(--color-ink)]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
                  {step.description}
                </p>
                {step.duration && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-300)] px-3 py-1 text-[12px] font-medium text-[var(--color-ink)]/70">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {step.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
