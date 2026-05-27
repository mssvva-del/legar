"use client";

import { Phone } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface PhoneButtonProps {
  variant?: "ghost" | "outline" | "primary" | "accent" | "icon";
  source: string;
  className?: string;
  showNumber?: boolean;
}

export function PhoneButton({
  variant = "ghost",
  source,
  className,
  showNumber = true,
}: PhoneButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2";

  const variants = {
    ghost:
      "text-[var(--color-ink)] hover:text-[var(--color-primary)]",
    outline:
      "rounded-[8px] border-2 border-[var(--color-primary)] px-4 py-2.5 text-[var(--color-primary)] hover:bg-[var(--color-bg-200)]",
    primary:
      "rounded-[8px] bg-[var(--color-primary)] px-6 py-3.5 text-white hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98]",
    accent:
      "rounded-[8px] bg-[var(--color-accent)] px-6 py-3.5 text-[var(--color-ink)] hover:bg-[var(--color-accent-600)] hover:scale-[1.02] active:scale-[0.98]",
    icon: "rounded-full p-2.5 text-[var(--color-ink)] hover:bg-[var(--color-bg-200)]",
  };

  return (
    <a
      href={CONTACTS.phoneTel}
      onClick={() => trackEvent({ name: "phone_clicked", source })}
      aria-label={`Зателефонувати ${CONTACTS.phone}`}
      className={cn(base, variants[variant], className)}
    >
      <Phone className="h-5 w-5" aria-hidden="true" />
      {showNumber && variant !== "icon" && (
        <span className="font-semibold tabular-nums">{CONTACTS.phone}</span>
      )}
    </a>
  );
}
