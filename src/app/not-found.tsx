import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { CONTACTS } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-bg-200)] px-4 py-16 text-center">
      <Logo size="lg" showTagline />

      <p className="mt-10 font-[family-name:var(--font-manrope)] text-[120px] font-extrabold leading-none text-[var(--color-primary)] md:text-[160px]">
        404
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[36px]">
        Сторінку не знайдено
      </h1>
      <p className="mt-3 max-w-[520px] text-[16px] leading-relaxed text-[var(--color-ink)]/70">
        Можливо, ця сторінка переїхала або ще в розробці. Зателефонуйте на нашу
        гарячу лінію — допоможемо вже зараз.
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
          className="inline-flex h-12 items-center gap-2 rounded-[8px] border-2 border-[var(--color-primary)] px-6 text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-white"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {CONTACTS.phone}
        </a>
      </div>
    </div>
  );
}
