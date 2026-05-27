"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Phone } from "lucide-react";
import {
  TelegramIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";
import { Logo } from "@/components/shared/Logo";
import {
  NAV_PRIMARY,
  SERVICES,
  CITIES,
  CONTACTS,
} from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSOS: () => void;
}

export function MobileMenu({ open, onClose, onOpenSOS }: MobileMenuProps) {
  // Lock scroll коли меню відкрите.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Esc закриває меню.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Головне меню"
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] bg-white transition-[opacity,transform] duration-300 ease-out lg:hidden ${
        open
          ? "translate-x-0 opacity-100 pointer-events-auto"
          : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-bg-300)] px-4 py-4">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити меню"
            className="rounded-full p-2.5 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)]"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6">
          <ul className="flex flex-col gap-1">
            {NAV_PRIMARY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-[12px] px-3 py-3 text-[20px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-200)]"
                >
                  {item.label}
                </Link>
                {item.dropdown === "services" && (
                  <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-[var(--color-bg-300)] pl-3">
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/poslugy/${s.slug}` as `/poslugy/${string}`}
                          onClick={onClose}
                          className="block py-2 text-[15px] text-[var(--color-ink)]/75 transition-colors hover:text-[var(--color-primary)]"
                        >
                          {s.shortTitle}
                          <span className="ml-2 text-xs text-[var(--color-ink)]/45">
                            {s.priceLabel}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {item.dropdown === "cities" && (
                  <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-[var(--color-bg-300)] pl-3">
                    {CITIES.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/mista/${c.slug}` as `/mista/${string}`}
                          onClick={onClose}
                          className="block py-2 text-[15px] text-[var(--color-ink)]/75 transition-colors hover:text-[var(--color-primary)]"
                        >
                          {c.nameUk}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSOS();
              }}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-6 text-[16px] font-semibold text-[var(--color-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              SOS 24/7
            </button>
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--color-primary)] px-6 text-[16px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-200)]"
            >
              {CONTACTS.phone}
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--color-bg-300)] px-4 py-6">
          <div className="mb-4 flex items-center justify-around">
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="rounded-full p-3 text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a
              href={CONTACTS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full p-3 text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={CONTACTS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="rounded-full p-3 text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
            <a
              href={CONTACTS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full p-3 text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-primary)]"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
          <p className="text-center text-xs text-[var(--color-ink)]/55">
            LEGAR — інформаційно-консультаційна платформа. Юридичні послуги
            надають адвокати-партнери НААУ.
          </p>
        </div>
      </div>
    </div>
  );
}
