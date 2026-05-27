import { CheckCircle2 } from "lucide-react";
import type { IncludedItem } from "@/lib/services-content";

interface WhatsIncludedListProps {
  items: IncludedItem[];
}

export function WhatsIncludedList({ items }: WhatsIncludedListProps) {
  return (
    <section aria-labelledby="included-heading" className="py-16 md:py-20">
      <div className="container-legar">
        <h2
          id="included-heading"
          className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
        >
          Що входить до послуги
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-5"
            >
              <span className="mt-0.5 flex-shrink-0 text-[28px] leading-none" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-success)]"
                    aria-hidden="true"
                  />
                  <h3 className="font-[family-name:var(--font-manrope)] text-[15px] font-bold leading-snug text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                </div>
                {item.description && (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink)]/60">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
