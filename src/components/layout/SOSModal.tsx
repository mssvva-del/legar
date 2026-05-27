"use client";

import { useEffect, useRef, useState } from "react";
import { X, Phone, MessageSquare } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { LeadForm } from "@/components/shared/LeadForm";

interface SOSModalProps {
  open: boolean;
  onClose: () => void;
  source: string;
}

export function SOSModal({ open, onClose, source }: SOSModalProps) {
  const [mode, setMode] = useState<"choice" | "form">("choice");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      // Скидаємо стан при закритті.
      const t = setTimeout(() => setMode("choice"), 250);
      return () => clearTimeout(t);
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[var(--color-ink)]/60 backdrop-blur-sm md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="fade-up relative w-full max-w-[520px] rounded-t-[24px] bg-white p-6 shadow-2xl md:rounded-[20px] md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 rounded-full p-2 text-[var(--color-ink)]/60 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-ink)]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
          SOS · 24/7
        </div>

        <h2
          id="sos-title"
          className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-[1.15] text-[var(--color-ink)]"
        >
          {mode === "choice"
            ? "Як вам зручніше?"
            : "Залиште номер — передзвонимо за 15 хв"}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]/70">
          {mode === "choice"
            ? "Гаряча лінія працює цілодобово. Або залиште заявку — менеджер зателефонує впродовж 15 хвилин."
            : "Менеджер передзвонить впродовж 15 хвилин, навіть вночі. Розкажете деталі — підберемо адвоката-партнера."}
        </p>

        {mode === "choice" ? (
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={CONTACTS.phoneTel}
              onClick={() => {
                trackEvent({ name: "phone_clicked", source: `sos_modal_${source}` });
                onClose();
              }}
              className="inline-flex h-[58px] items-center justify-center gap-3 rounded-[12px] bg-[var(--color-accent)] px-6 text-[18px] font-semibold text-[var(--color-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Зателефонувати: {CONTACTS.phone}
            </a>
            <button
              type="button"
              onClick={() => setMode("form")}
              className="inline-flex h-[58px] items-center justify-center gap-3 rounded-[12px] border-2 border-[var(--color-primary)] bg-white px-6 text-[18px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-200)]"
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              Залишити заявку
            </button>
            <p className="mt-2 text-center text-xs text-[var(--color-ink)]/55">
              Виїзд адвоката на ТЦК — 7 500 грн. На затримання поліцією — 10 000 грн.
              Ціни фіксовані.
            </p>
          </div>
        ) : (
          <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1">
            <LeadForm variant="compact" source={`sos_modal_${source}`} onSuccess={() => onClose()} />
            <button
              type="button"
              onClick={() => setMode("choice")}
              className="mt-3 w-full text-center text-sm text-[var(--color-ink)]/60 underline underline-offset-2 hover:text-[var(--color-primary)]"
            >
              ← Назад до варіантів
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
