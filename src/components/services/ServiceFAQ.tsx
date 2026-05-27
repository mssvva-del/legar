"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/services-content";

interface ServiceFAQProps {
  items: FaqItem[];
}

export function ServiceFAQ({ items }: ServiceFAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-[var(--color-bg-200)] py-16 md:py-20"
      id="faq"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px]">
          <h2
            id="faq-heading"
            className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
          >
            Часті запитання
          </h2>

          <dl className="mt-8 space-y-3">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="rounded-[12px] border border-[var(--color-bg-300)] bg-white overflow-hidden"
                >
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-[family-name:var(--font-manrope)] text-[15px] font-bold text-[var(--color-ink)]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 flex-shrink-0 text-[var(--color-primary)] transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="px-6 pb-5 text-[14px] leading-relaxed text-[var(--color-ink)]/70">
                      {item.answer}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
