import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingBlock as PricingBlockType } from "@/lib/services-content";

interface PricingBlockProps {
  pricing: PricingBlockType;
  slug: string;
}

export function PricingBlock({ pricing, slug }: PricingBlockProps) {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="py-16 md:py-20"
      id="pricing"
    >
      <div className="container-legar">
        <h2
          id="pricing-heading"
          className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
        >
          {pricing.headline}
        </h2>

        {/* Main price — if no packages */}
        {!pricing.packages && (
          <div className="mt-8 flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[family-name:var(--font-manrope)] text-[48px] font-extrabold text-[var(--color-ink)]">
                {pricing.mainPrice}
              </p>
              {pricing.marketComparison && (
                <p className="mt-2 text-[14px] text-[var(--color-ink)]/55">
                  {pricing.marketComparison}
                </p>
              )}
            </div>
            <Link
              href={`/poslugy/${slug}#lead-form` as `/poslugy/${string}`}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02]"
            >
              Замовити
            </Link>
          </div>
        )}

        {/* Packages */}
        {pricing.packages && (
          <>
            {pricing.marketComparison && (
              <p className="mt-3 text-[14px] text-[var(--color-ink)]/55">
                {pricing.marketComparison}
              </p>
            )}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pricing.packages.map((pkg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col rounded-[var(--radius-card)] border p-7 transition-shadow",
                    pkg.highlighted
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-card-hover)]"
                      : "border-[var(--color-bg-300)] bg-white hover:shadow-[var(--shadow-card)]",
                  )}
                >
                  <p
                    className={cn(
                      "text-[13px] font-semibold uppercase tracking-wide",
                      pkg.highlighted ? "text-white/70" : "text-[var(--color-ink)]/55",
                    )}
                  >
                    {pkg.name}
                  </p>
                  <p
                    className={cn(
                      "mt-2 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold",
                      pkg.highlighted ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                    )}
                  >
                    {pkg.price}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 h-4 w-4 flex-shrink-0",
                            pkg.highlighted ? "text-[var(--color-accent)]" : "text-[var(--color-success)]",
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "text-[14px]",
                            pkg.highlighted ? "text-white/90" : "text-[var(--color-ink)]/70",
                          )}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/poslugy/${slug}#lead-form` as `/poslugy/${string}`}
                    className={cn(
                      "mt-7 inline-flex h-[48px] items-center justify-center rounded-[8px] text-[14px] font-semibold transition-all hover:scale-[1.02]",
                      pkg.highlighted
                        ? "bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-white"
                        : "bg-[var(--color-bg-200)] text-[var(--color-ink)] hover:bg-[var(--color-primary)] hover:text-white",
                    )}
                  >
                    Обрати пакет
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Guarantee */}
        {pricing.guaranteeText && (
          <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-5">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <p className="text-[14px] text-[var(--color-ink)]/75">{pricing.guaranteeText}</p>
          </div>
        )}

        {/* Disclaimer */}
        {pricing.disclaimer && (
          <p className="mt-4 text-[12px] text-[var(--color-ink)]/45">{pricing.disclaimer}</p>
        )}
      </div>
    </section>
  );
}
