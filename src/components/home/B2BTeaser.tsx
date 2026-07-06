import Link from "next/link";
import { Download, Check } from "lucide-react";
import { B2BBuilding, DotPattern } from "@/components/shared/Illustration";

const BENEFITS = [
  "Отримання статусу критичності за 30 днів",
  "Бронювання до 100 співробітників",
  "HR-комплаєнс воєнного обліку",
  "12 місяців консультаційного супроводу",
];

export function B2BTeaser() {
  return (
    <section
      aria-labelledby="b2b-title"
      className="relative overflow-hidden bg-[var(--color-ink)] py-20 text-white md:py-24"
    >
      <DotPattern className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="container-legar relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-7">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Для бізнесу
          </p>
          <h2
            id="b2b-title"
            className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.08] md:text-[44px]"
          >
            Збережіть ключових співробітників.
            <br />
            <span className="text-[var(--color-accent)]">Легально.</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-white/75">
            LEGAR Business — повний пакет для отримання статусу критично
            важливого підприємства та бронювання до 100 співробітників.
            Юридичний супровід, документи, подача через Дію, моніторинг.
          </p>

          <ul className="mt-7 space-y-3">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-[15px] text-white/90"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 font-[family-name:var(--font-manrope)] text-[22px] font-extrabold text-[var(--color-accent)]">
            Пакет від 50 000 грн
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={"/poslugy/b2b-bronyuvannya" as const}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-ink)] transition-all hover:bg-[var(--color-accent-600)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Завантажити бриф для HR-директора (PDF)
            </Link>
            <Link
              href={"/kontakty?topic=b2b" as `/kontakty?topic=${string}`}
              className="inline-flex h-[52px] items-center justify-center rounded-[8px] border-2 border-white/30 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Замовити консультацію
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="mx-auto max-w-[460px]">
            <B2BBuilding className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
