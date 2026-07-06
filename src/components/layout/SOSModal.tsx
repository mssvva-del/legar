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

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.6l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.959z"/>
    </svg>
  );
}


export function SOSModal({ open, onClose, source }: SOSModalProps) {
  const [mode, setMode] = useState<"choice" | "form">("choice");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setMode("choice"), 250);
      return () => clearTimeout(t);
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[var(--color-ink)]/60 backdrop-blur-sm md:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        className="fade-up relative w-full max-w-[480px] rounded-t-[24px] bg-white p-6 shadow-2xl md:rounded-[20px] md:p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 rounded-full p-2 text-[var(--color-ink)]/60 transition-colors hover:bg-[var(--color-bg-200)] hover:text-[var(--color-ink)]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {mode === "choice" ? (
          <>
            <h2
              id="contact-modal-title"
              className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold leading-[1.15] text-[var(--color-ink)] pr-8"
            >
              Зв'язатися з нами
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink)]/65">
              Оберіть зручний спосіб — відповімо впродовж 15 хвилин.
            </p>

            {/* Phones */}
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={CONTACTS.phoneTel}
                onClick={() => { trackEvent({ name: "phone_clicked", source: `modal_${source}` }); onClose(); }}
                className="inline-flex h-[52px] items-center justify-between gap-3 rounded-[12px] bg-[var(--color-accent)] px-5 text-[16px] font-semibold text-[var(--color-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2.5">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {CONTACTS.phone}
                </span>
                <span className="text-[11px] font-medium text-[var(--color-ink)]/60 bg-white/60 px-2 py-0.5 rounded-full">безкоштовно</span>
              </a>
              <a
                href={CONTACTS.phoneDirectTel}
                onClick={() => { trackEvent({ name: "phone_direct_clicked", source: `modal_${source}` }); onClose(); }}
                className="inline-flex h-[52px] items-center gap-3 rounded-[12px] border border-[var(--color-bg-300)] bg-white px-5 text-[16px] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {CONTACTS.phoneDirect}
              </a>
            </div>

            {/* Messengers */}
            {/* Telegram channel */}
            <div className="mt-4">
              <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]/45">
                Або підпишіться на канал
              </p>
              <a
                href={CONTACTS.telegramChannel}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { trackEvent({ name: "telegram_clicked", source: `modal_${source}` }); onClose(); }}
                className="flex items-center gap-3 rounded-[12px] bg-[#29A8EB]/10 px-4 py-3 text-[#0088CC] transition-colors hover:bg-[#29A8EB]/20"
              >
                <TelegramIcon />
                <span className="text-[14px] font-semibold">Telegram-канал LEGAR</span>
                <span className="ml-auto text-[12px] text-[#0088CC]/60">{CONTACTS.telegramChannelHandle}</span>
              </a>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--color-bg-300)]" />
              <span className="text-[12px] text-[var(--color-ink)]/40">або залиште заявку</span>
              <div className="h-px flex-1 bg-[var(--color-bg-300)]" />
            </div>

            {/* Leave request */}
            <button
              type="button"
              onClick={() => setMode("form")}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] border-2 border-[var(--color-primary)] bg-white text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-200)]"
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              Залишити заявку — передзвонимо
            </button>

            <p className="mt-4 text-center text-[11px] text-[var(--color-ink)]/40">
              Виїзд адвоката на ТЦК — від 8 000 грн. Ціни фіксовані.
            </p>
          </>
        ) : (
          <>
            <h2
              id="contact-modal-title"
              className="font-[family-name:var(--font-manrope)] text-[22px] font-extrabold leading-[1.15] text-[var(--color-ink)] pr-8"
            >
              Залишити заявку
            </h2>
            <p className="mt-1.5 mb-5 text-[14px] text-[var(--color-ink)]/65">
              Менеджер зателефонує впродовж 15 хвилин.
            </p>
            <LeadForm variant="compact" source={`modal_${source}`} onSuccess={() => onClose()} />
            <button
              type="button"
              onClick={() => setMode("choice")}
              className="mt-3 w-full text-center text-sm text-[var(--color-ink)]/60 underline underline-offset-2 hover:text-[var(--color-primary)]"
            >
              ← Назад до варіантів
            </button>
          </>
        )}
      </div>
    </div>
  );
}
