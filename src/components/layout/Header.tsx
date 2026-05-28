"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronDown,
  Phone,
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { MobileMenu } from "./MobileMenu";
import { SOSModal } from "./SOSModal";
import { NAV_PRIMARY, SERVICES, CITIES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "services" | "cities" | null
  >(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const openDropdown = (key: "services" | "cities") => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveDropdown(key);
  };
  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  // Close on route change handled via Link onClick.
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleSOS = () => {
    trackEvent({ name: "sos_opened", source: "header" });
    setSosOpen(true);
  };

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-[var(--color-bg-300)] bg-white/95 backdrop-blur-sm"
      >
        <div className="container-legar flex h-[80px] items-center justify-between gap-4">
          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Відкрити меню"
            aria-expanded={mobileOpen}
            className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)] lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-initial">
            <Logo showTagline size="md" className="mx-auto lg:mx-0" />
          </div>

          {/* Desktop nav */}
          <nav
            aria-label="Головне меню"
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          >
            {NAV_PRIMARY.map((item) => {
              if (!item.dropdown) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[8px] px-3 py-2 text-[15px] font-semibold text-[var(--color-ink)]/85 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = activeDropdown === item.dropdown;
              return (
                <div
                  key={item.href}
                  onMouseEnter={() => openDropdown(item.dropdown!)}
                  onMouseLeave={scheduleClose}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setActiveDropdown(isOpen ? null : item.dropdown!)
                    }
                    className={cn(
                      "inline-flex items-center gap-1 rounded-[8px] px-3 py-2 text-[15px] font-semibold transition-colors",
                      isOpen
                        ? "bg-[var(--color-bg-200)] text-[var(--color-primary)]"
                        : "text-[var(--color-ink)]/85 hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && item.dropdown === "services" && (
                    <div
                      role="menu"
                      onMouseEnter={() => openDropdown("services")}
                      onMouseLeave={scheduleClose}
                      className="fade-up absolute left-1/2 top-full mt-2 w-[520px] -translate-x-1/2 rounded-[16px] border border-[var(--color-bg-300)] bg-white p-3 shadow-[var(--shadow-card-hover)]"
                    >
                      <ul className="grid grid-cols-1 gap-1">
                        {SERVICES.map((s) => {
                          const Icon = ICON_MAP[s.icon] ?? Shield;
                          return (
                            <li key={s.slug} role="none">
                              <Link
                                role="menuitem"
                                href={`/poslugy/${s.slug}` as `/poslugy/${string}`}
                                onClick={() => setActiveDropdown(null)}
                                className="group flex items-start gap-3 rounded-[12px] p-3 transition-colors hover:bg-[var(--color-bg-200)]"
                              >
                                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                  <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="flex flex-1 flex-col">
                                  <span className="flex items-baseline justify-between gap-3">
                                    <span className="font-[family-name:var(--font-manrope)] text-[15px] font-extrabold text-[var(--color-ink)]">
                                      {s.shortTitle}
                                    </span>
                                    <span className="text-[12px] font-semibold text-[var(--color-primary)]">
                                      {s.priceLabel}
                                    </span>
                                  </span>
                                  <span className="mt-0.5 text-[13px] leading-snug text-[var(--color-ink)]/65">
                                    {s.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-2 border-t border-[var(--color-bg-300)] pt-3 text-center">
                        <Link
                          href={"/poslugy" as const}
                          onClick={() => setActiveDropdown(null)}
                          className="text-[13px] font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          Усі послуги та ціни →
                        </Link>
                      </div>
                    </div>
                  )}

                  {isOpen && item.dropdown === "cities" && (
                    <div
                      role="menu"
                      onMouseEnter={() => openDropdown("cities")}
                      onMouseLeave={scheduleClose}
                      className="fade-up absolute left-1/2 top-full mt-2 w-[240px] -translate-x-1/2 rounded-[16px] border border-[var(--color-bg-300)] bg-white p-2 shadow-[var(--shadow-card-hover)]"
                    >
                      <ul>
                        {CITIES.map((c) => (
                          <li key={c.slug} role="none">
                            <Link
                              role="menuitem"
                              href={`/mista/${c.slug}` as `/mista/${string}`}
                              onClick={() => setActiveDropdown(null)}
                              className="block rounded-[8px] px-3 py-2.5 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]"
                            >
                              {c.nameUk}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Зв'язатися — mobile icon */}
            <button
              type="button"
              onClick={handleSOS}
              aria-label="Зв'язатися"
              className="-ml-1 inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)] lg:hidden"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Зв'язатися — desktop */}
            <button
              type="button"
              onClick={handleSOS}
              className="hidden h-11 items-center gap-2 rounded-[8px] px-4 text-[14px] font-semibold text-[var(--color-ink)]/85 transition-all hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)] lg:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Зв'язатися
            </button>

            {/* SOS */}
            <button
              type="button"
              onClick={handleSOS}
              className="hidden h-11 items-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-4 text-[14px] font-semibold text-[var(--color-ink)] transition-all hover:bg-[var(--color-accent-600)] hover:scale-[1.03] active:scale-[0.97] md:inline-flex"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
              SOS 24/7
            </button>

            {/* Login */}
            <Link
              href={"/cabinet" as `/cabinet`}
              className="hidden h-11 items-center rounded-[8px] border-2 border-[var(--color-primary)] px-4 text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-200)] xl:inline-flex"
            >
              Увійти
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSOS={handleSOS}
      />
      <SOSModal
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        source="header"
      />
    </>
  );
}
