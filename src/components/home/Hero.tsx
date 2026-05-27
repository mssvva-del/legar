import Link from "next/link";
import { ShieldCheck, Sparkles, Phone, CheckCircle2 } from "lucide-react";
import { HeroShield, HeroBlob } from "@/components/shared/Illustration";
import { CONTACTS } from "@/lib/constants";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-white"
    >
      {/* Decorative blob top-right */}
      <HeroBlob
        className="pointer-events-none absolute -right-32 -top-32 h-[720px] w-[720px] opacity-90"
      />

      <div className="container-legar relative grid grid-cols-1 gap-12 pb-16 pt-16 md:pb-20 md:pt-24 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-24 lg:pt-28">
        {/* Left column — 7/12 desktop */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-200)] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink)]">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[var(--color-accent-600)]"
              aria-hidden="true"
            />
            ЮРИДИЧНИЙ ЩИТ
            <span className="text-[var(--color-ink)]/40">·</span>
            Гаряча лінія 24/7
          </div>

          <h1
            id="hero-title"
            className="mt-6 font-[family-name:var(--font-manrope)] text-[40px] font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-[52px] lg:text-[56px] lg:leading-[1.08]"
          >
            Не залишайтесь сам на сам із системою.
            <br />
            <span className="accent-underline">
              Юридичний щит для українців 24/7.
            </span>
          </h1>

          <p className="mt-6 max-w-[620px] text-[18px] leading-[1.55] text-[var(--color-ink)]/70 md:text-[19px]">
            Безкоштовна AI-діагностика вашої справи за 5 хвилин.
            Адвокати-партнери НААУ поруч у будь-якому місті України.
            Прозорі ціни. Цифровий кабінет справи.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={"/poslugy/ai-diagnostyka" as const}
              className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-7 text-[16px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Пройти AI-діагностику безкоштовно
            </Link>
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-7 text-[16px] font-semibold text-[var(--color-ink)] transition-all duration-200 hover:bg-[var(--color-accent-600)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {CONTACTS.phone}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-[var(--color-ink)]/75">
            {[
              "Адвокати НААУ",
              "Прозорі ціни",
              "Цифровий кабінет",
              "Відповідь за 15 хвилин",
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2
                  className="h-4 w-4 text-[var(--color-success)]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — illustration 5/12 */}
        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="relative mx-auto max-w-[440px]">
            <HeroShield className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
