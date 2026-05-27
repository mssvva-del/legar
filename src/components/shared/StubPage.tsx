import Link from "next/link";
import { ArrowLeft, Phone, Construction } from "lucide-react";
import { CONTACTS } from "@/lib/constants";

interface StubPageProps {
  title: string;
  intro?: string;
}

/**
 * Універсальна сторінка-заглушка для маршрутів, які ще в розробці.
 */
export function StubPage({ title, intro }: StubPageProps) {
  return (
    <div className="bg-white py-20 md:py-28">
      <div className="container-legar mx-auto max-w-[760px] text-center">
        <span
          aria-hidden="true"
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent-600)]"
        >
          <Construction className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-[family-name:var(--font-manrope)] text-[36px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[48px]">
          {title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
          {intro ??
            "Сторінка в розробці. Скоро тут буде детальний контент. Зателефонуйте 0 800 357 288 або залиште заявку — ми допоможемо вже зараз."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={"/" as const}
            className="inline-flex h-12 items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-6 text-[15px] font-semibold text-white transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            На головну
          </Link>
          <a
            href={CONTACTS.phoneTel}
            className="inline-flex h-12 items-center gap-2 rounded-[8px] border-2 border-[var(--color-primary)] px-6 text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-200)]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {CONTACTS.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
