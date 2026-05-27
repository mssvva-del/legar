import Link from "next/link";
import { Sparkles, Phone } from "lucide-react";
import { TelegramIcon } from "@/components/icons/SocialIcons";
import { CONTACTS } from "@/lib/constants";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="bg-[var(--color-accent)] py-20 md:py-24"
    >
      <div className="container-legar text-center">
        <div className="mx-auto max-w-[760px]">
          <h2
            id="final-cta-title"
            className="font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[44px]"
          >
            Маєте складну ситуацію? Не чекайте.
          </h2>
          <p className="mt-5 text-[18px] leading-relaxed text-[var(--color-ink)]/80">
            AI-діагностика покаже наступні кроки за 5 хвилин. Безкоштовно.
            Адвокат-партнер LEGAR доступний по гарячій лінії цілодобово.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={"/poslugy/ai-diagnostyka" as const}
              className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-7 text-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Пройти AI-діагностику
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
              <TelegramIcon className="h-5 w-5" />
              Написати в Telegram
            </a>
          </div>

          <p className="mt-8 text-[13px] text-[var(--color-ink)]/60">
            LEGAR — інформаційно-консультаційна платформа. Юридичні послуги
            надають адвокати-партнери НААУ.
          </p>
        </div>
      </div>
    </section>
  );
}
