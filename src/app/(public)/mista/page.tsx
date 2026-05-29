import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { CITIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Міста",
  description:
    "Адвокати-партнери LEGAR у Києві, Львові, Дніпрі, Харкові, Одесі та інших обласних центрах України. Виїзд у ТЦК, оскарження ВЛК, SOS 24/7.",
};

export default function MistaPage() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-legar mx-auto max-w-[1080px]">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-manrope)] text-[40px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[56px]">
            Міста, де ми працюємо
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-[18px] leading-relaxed text-[var(--color-ink)]/70">
            Адвокати-партнери LEGAR представлені у {CITIES.length} містах
            України. Виїзд у ТЦК — у будь-яке місто за окремою заявкою.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/mista/${c.slug}` as `/mista/${string}`}
                className="group flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-[family-name:var(--font-manrope)] text-[22px] font-extrabold text-[var(--color-ink)]">
                    {c.nameUk}
                  </span>
                </div>
                <ArrowRight
                  className="h-5 w-5 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
