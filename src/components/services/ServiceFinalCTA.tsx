import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACTS } from "@/lib/constants";

interface ServiceFinalCTAProps {
  serviceName: string;
  ctaLabel: string;
  slug: string;
}

export function ServiceFinalCTA({ serviceName, ctaLabel, slug }: ServiceFinalCTAProps) {
  return (
    <section
      aria-labelledby="service-cta-heading"
      className="bg-[var(--color-accent)] py-20 md:py-24"
      id="lead-form"
    >
      <div className="container-legar text-center">
        <div className="mx-auto max-w-[680px]">
          <h2
            id="service-cta-heading"
            className="font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[42px]"
          >
            Готові замовити «{serviceName}»?
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/75">
            Залиште заявку — менеджер LEGAR зв'яжеться протягом 15 хвилин і відповість на всі
            питання.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/poslugy/${slug}#lead-form` as `/poslugy/${string}`}
              className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-8 text-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              {ctaLabel}
            </Link>
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--color-ink)] bg-transparent px-7 text-[16px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-accent)] sm:w-auto"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {CONTACTS.phone}
            </a>
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[56px] w-full items-center justify-center gap-2 px-4 text-[16px] font-semibold text-[var(--color-ink)] underline-offset-4 transition-colors hover:underline sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Написати в Telegram
            </a>
          </div>

          <p className="mt-7 text-[12px] text-[var(--color-ink)]/50">
            LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.
          </p>
        </div>
      </div>
    </section>
  );
}
