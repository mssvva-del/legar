"use client";

import { Phone, MessageCircle } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { LeadForm } from "@/components/shared/LeadForm";

interface ServiceFinalCTAProps {
  serviceName: string;
  ctaLabel: string;
  slug: string;
}

export function ServiceFinalCTA({ serviceName, ctaLabel, slug }: ServiceFinalCTAProps) {
  return (
    <section
      aria-labelledby="service-cta-heading"
      className="bg-[var(--color-accent)] py-16 md:py-20"
      id="lead-form"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[720px]">
          <div className="text-center mb-8">
            <h2
              id="service-cta-heading"
              className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[38px]"
            >
              Готові замовити «{serviceName}»?
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[var(--color-ink)]/75">
              Залиште заявку — менеджер LEGAR зв'яжеться протягом 15 хвилин.
            </p>
          </div>

          {/* Форма заявки */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <LeadForm
              variant="full"
              defaultService={slug}
              source={`service-cta-${slug}`}
            />
          </div>

          {/* Альтернативні контакти */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--color-ink)] bg-transparent px-6 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-accent)] w-full sm:w-auto"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {CONTACTS.phone}
            </a>
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[48px] items-center justify-center gap-2 px-4 text-[15px] font-semibold text-[var(--color-ink)] underline-offset-4 transition-colors hover:underline w-full sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Написати в Telegram
            </a>
          </div>

          <p className="mt-6 text-center text-[12px] text-[var(--color-ink)]/50">
            LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.
          </p>
        </div>
      </div>
    </section>
  );
}
