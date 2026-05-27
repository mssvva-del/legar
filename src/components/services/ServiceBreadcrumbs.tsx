import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface ServiceBreadcrumbsProps {
  crumbs: Crumb[];
}

export function ServiceBreadcrumbs({ crumbs }: ServiceBreadcrumbsProps) {
  return (
    <nav aria-label="Хлібні крихти" className="py-3">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] text-[var(--color-ink)]/55">
        <li>
          <Link
            href="/"
            className="hover:text-[var(--color-primary)] transition-colors"
          >
            Головна
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[var(--color-ink)]/80">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
