import { AlarmClock } from "lucide-react";
import type { TimingBlock as TimingBlockType } from "@/lib/services-content";

interface TimingBlockProps {
  timing: TimingBlockType;
}

export function TimingBlock({ timing }: TimingBlockProps) {
  return (
    <section
      aria-labelledby="timing-heading"
      className="bg-[var(--color-bg-200)] py-12 md:py-16"
    >
      <div className="container-legar">
        <div className="flex items-center gap-3">
          <AlarmClock
            className="h-6 w-6 text-[var(--color-primary)]"
            aria-hidden="true"
          />
          <h2
            id="timing-heading"
            className="font-[family-name:var(--font-manrope)] text-[22px] font-extrabold text-[var(--color-ink)]"
          >
            {timing.headline}
          </h2>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {timing.items.map((item, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-[var(--color-bg-300)] bg-white p-5"
            >
              <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-ink)]/45">
                {item.label}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-manrope)] text-[20px] font-extrabold text-[var(--color-ink)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {timing.note && (
          <p className="mt-5 text-[13px] italic text-[var(--color-ink)]/55">
            {timing.note}
          </p>
        )}
      </div>
    </section>
  );
}
