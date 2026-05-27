import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import type { ServiceHero as ServiceHeroType } from "@/lib/services-content";

interface ServiceHeroProps {
  hero: ServiceHeroType;
  priceLabel: string;
  slug: string;
}

export function ServiceHero({ hero, priceLabel, slug }: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] py-20 md:py-28">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)] opacity-[0.08] blur-[80px]"
        aria-hidden="true"
      />

      <div className="container-legar relative z-10">
        <div className="mx-auto max-w-[800px]">
          {/* Badge */}
          {hero.badge && (
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[12px] font-semibold text-[var(--color-ink)]">
              <Shield className="h-3 w-3" aria-hidden="true" />
              {hero.badge}
            </span>
          )}

          {/* H1 */}
          <h1 className="font-[family-name:var(--font-manrope)] text-[36px] font-extrabold leading-[1.1] text-white md:text-[52px]">
            {hero.h1}
          </h1>

          {/* Sub */}
          <p className="mt-5 text-[18px] leading-relaxed text-white/70 md:text-[20px]">
            {hero.sub}
          </p>

          {/* Trust tags */}
          {hero.trustTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {hero.trustTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[13px] text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/poslugy/${slug}#lead-form` as `/poslugy/${string}`}
              className="inline-flex h-[56px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-8 text-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {hero.ctaLabel}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>

            <span className="font-[family-name:var(--font-manrope)] text-[20px] font-extrabold text-[var(--color-accent)]">
              {priceLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
