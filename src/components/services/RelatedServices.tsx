import Link from "next/link";
import {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";
import type { ServiceSlug } from "@/lib/services-content";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
};

interface RelatedServicesProps {
  slugs: ServiceSlug[];
}

export function RelatedServices({ slugs }: RelatedServicesProps) {
  const services = SERVICES.filter((s) => (slugs as string[]).includes(s.slug));

  if (services.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="py-16 md:py-20">
      <div className="container-legar">
        <h2
          id="related-heading"
          className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)]"
        >
          Схожі послуги
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? Shield;
            return (
              <Link
                key={service.slug}
                href={`/poslugy/${service.slug}` as `/poslugy/${string}`}
                className="group flex items-center gap-4 rounded-[12px] border border-[var(--color-bg-300)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-[family-name:var(--font-manrope)] text-[15px] font-bold text-[var(--color-ink)]">
                    {service.shortTitle}
                  </p>
                  <p className="text-[13px] text-[var(--color-ink)]/55">{service.priceLabel}</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 flex-shrink-0 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
