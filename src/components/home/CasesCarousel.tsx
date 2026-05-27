"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CASES = [
  {
    tag: "ВЛК",
    title: "Зміна категорії придатності",
    description:
      "Клієнт, 34 роки, м. Київ. ВЛК визнала придатним, незважаючи на хронічне захворювання, підтверджене медичними документами. Адвокат-партнер подав скаргу, замовив додаткову експертизу, представив справу у вищій ВЛК. Категорія змінена.",
    result: "Категорія змінена на обмежено придатний",
    duration: "23 дні",
  },
  {
    tag: "СЗЧ",
    title: "Закриття провадження за ст. 407 ККУ",
    description:
      "Військовослужбовець, 28 років, м. Львів. Проти нього відкрили кримінальне провадження за СЗЧ після 3 днів відсутності у частині через лікування близького родича. Адвокат довів відсутність умислу, подав необхідні документи.",
    result: "Провадження закрите",
    duration: "47 днів",
  },
  {
    tag: "ТЦК",
    title: "Скасування постанови про штраф",
    description:
      "Чоловік, 41 рік, м. Дніпро. Отримав постанову ТЦК про штраф 17 000 грн за порушення правил військового обліку. Адвокат-партнер довів процедурні порушення з боку ТЦК і відсутність складу правопорушення.",
    result: "Постанова скасована. Штраф 0 грн.",
    duration: "31 день",
  },
];

export function CasesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
    setActive(index);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const dist = Math.abs(el.offsetLeft - track.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  };

  return (
    <section
      aria-labelledby="cases-title"
      className="bg-white py-20 md:py-24"
    >
      <div className="container-legar">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[680px]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-600)]">
              Реальні результати
            </p>
            <h2
              id="cases-title"
              className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[40px]"
            >
              Кейси наших клієнтів
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
              Анонімізовані історії з реальної практики адвокатів-партнерів.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTo(Math.max(0, active - 1))}
              disabled={active === 0}
              aria-label="Попередній кейс"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-bg-300)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(Math.min(CASES.length - 1, active + 1))}
              disabled={active === CASES.length - 1}
              aria-label="Наступний кейс"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-bg-300)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {CASES.map((c) => (
            <article
              key={c.title}
              className="flex w-[88%] flex-shrink-0 snap-center flex-col rounded-[var(--radius-card)] bg-[var(--color-bg-200)] p-7 sm:w-[420px] md:w-[calc((100%-2.5rem)/3)]"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                {c.tag}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-[20px] font-extrabold leading-tight text-[var(--color-ink)]">
                {c.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/70">
                {c.description}
              </p>

              <div className="mt-5 space-y-2 border-t border-[var(--color-bg-300)] pt-4">
                <div className="flex items-start gap-2.5">
                  <Trophy
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-600)]"
                    aria-hidden="true"
                  />
                  <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {c.result}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] text-[var(--color-ink)]/60">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Тривалість: {c.duration}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {CASES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Кейс ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active
                    ? "w-8 bg-[var(--color-primary)]"
                    : "w-2 bg-[var(--color-bg-300)] hover:bg-[var(--color-primary)]/40",
                )}
              />
            ))}
          </div>
          <Link
            href={"/blog?filter=cases" as `/blog?filter=${string}`}
            className="text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-600)]"
          >
            Дивитись усі кейси →
          </Link>
        </div>
      </div>
    </section>
  );
}
