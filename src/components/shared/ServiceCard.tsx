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
import type { Service } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
};

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const Icon = ICON_MAP[service.icon] ?? Shield;
  return (
    <Link
      href={`/poslugy/${service.slug}` as `/poslugy/${string}`}
      className={cn(
        "group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] focus-visible:-translate-y-1 focus-visible:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-[12px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white"
      >
        <Icon className="h-7 w-7" />
      </span>

      <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-[22px] font-extrabold leading-tight text-[var(--color-ink)]">
        {service.shortTitle}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
        {service.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-4">
        <span className="font-[family-name:var(--font-manrope)] text-[18px] font-extrabold text-[var(--color-ink)]">
          <span className="text-[var(--color-accent-600)]">●</span>{" "}
          <span className="ml-0.5">{service.priceLabel}</span>
        </span>
        <span
          aria-hidden="true"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-all group-hover:translate-x-1 group-hover:bg-[var(--color-primary)] group-hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
