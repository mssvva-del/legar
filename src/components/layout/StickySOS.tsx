"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { SOSModal } from "./SOSModal";

export function StickySOS() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    trackEvent({ name: "sos_opened", source: "sticky" });
    setOpen(true);
  };

  return (
    <>
      {/* Desktop: pill кнопка */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Відкрити SOS — гаряча лінія 24/7"
        className="sos-pulse fixed bottom-6 right-6 z-50 hidden items-center gap-3 rounded-full bg-[var(--color-accent)] px-5 py-3.5 text-[15px] font-semibold text-[var(--color-ink)] shadow-[var(--shadow-sos)] transition-transform hover:scale-[1.05] active:scale-[0.97] md:inline-flex"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink)]/70">
            SOS · 24/7
          </span>
          <span className="tabular-nums">{CONTACTS.phone}</span>
        </span>
      </button>

      {/* Mobile: circular */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="SOS — гаряча лінія 24/7"
        className="sos-pulse fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-[var(--shadow-sos)] transition-transform active:scale-[0.95] md:hidden"
      >
        <Phone className="h-7 w-7 text-[var(--color-ink)]" aria-hidden="true" />
      </button>

      <SOSModal open={open} onClose={() => setOpen(false)} source="sticky" />
    </>
  );
}
