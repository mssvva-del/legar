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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.02 4.458.34 7.33.266 10.888c-.073 3.558-.173 10.217 6.251 12.023h.006l-.005 2.753s-.042.981.609 1.18c.79.241 1.254-.507 2.008-1.317.414-.447.984-1.102 1.415-1.6 3.9.328 6.897-.421 7.236-.532.787-.254 5.241-.825 5.968-6.735.751-6.088-.364-9.927-2.96-11.663l-.001-.001c-.747-.554-3.735-2.095-9.143-2.002a22.73 22.73 0 00-.252.007zm.064 1.993c4.724-.068 7.432 1.25 8.075 1.738 2.106 1.408 3.03 4.735 2.367 9.992-.59 4.833-4.15 5.177-4.806 5.385-.278.089-2.96.754-6.301.537 0 0-2.499 3.017-3.278 3.797-.122.124-.265.173-.361.149-.133-.033-.17-.183-.168-.403l.021-3.879c-.005.001-.005.001 0 0-5.353-1.488-5.047-7.017-4.986-9.989.06-2.973.6-5.42 2.269-7.085 1.973-1.837 5.524-2.174 7.168-2.242zm.35 3.233c-.357-.003-.714.02-1.058.076-.831.133-1.57.547-1.58 1.285 0 .419.172.721.456 1.015.447.461.94.904 1.427 1.349 1.015.926 2.079 1.716 3.154 2.491.26.188.528.341.795.514.327.209.671.318 1.015.16.327-.15.529-.546.672-.882a5.453 5.453 0 00.325-1.186c.067-.468-.127-.86-.505-1.044-.738-.359-1.483-.71-2.228-1.062-.334-.159-.66-.294-.985-.437-.321-.141-.618-.293-.93-.252l-.003-.001c-.161.023-.259.146-.296.34-.054.284.06.523.233.718.297.335.655.602 1.001.888.09.074.177.15.261.228-.178.064-.352.127-.521.2-.26.112-.481.257-.604.449-.228.356-.11.827.236 1.063l.001.001c.461.311.952.569 1.445.819.505.258 1.015.499 1.529.727.477.212.972.39 1.474.482.245.046.498.017.706-.135.215-.157.35-.412.43-.663.08-.251.119-.52.14-.79.025-.325-.024-.614-.218-.803-.199-.194-.49-.248-.77-.222-.28.026-.543.114-.806.209zm-2.95.457c-.14-.003-.286.026-.428.083a1.485 1.485 0 00-.587.428c-.328.381-.487.898-.493 1.449-.006.56.127 1.126.411 1.641.284.516.693.972 1.183 1.337.49.366 1.045.608 1.61.729.565.12 1.134.099 1.672-.048.269-.073.526-.177.762-.315.235-.138.445-.311.605-.518.16-.208.264-.444.25-.681-.015-.237-.152-.459-.383-.576-.231-.117-.513-.1-.771.009-.258.109-.48.278-.69.46-.21.183-.417.372-.645.523-.228.15-.479.25-.763.253-.284.003-.596-.083-.892-.273-.296-.19-.553-.481-.737-.818-.183-.337-.289-.719-.282-1.112.007-.393.127-.795.347-1.112.22-.317.536-.546.897-.618.362-.072.766.017 1.114.248.347.231.631.586.82.981.055.115.139.209.244.273.105.064.23.099.358.105l.002.001c.127.006.252-.018.364-.066.111-.048.208-.124.271-.227.063-.102.092-.23.068-.371-.023-.14-.097-.285-.219-.419-.47-.52-1.038-.955-1.65-1.182a3.07 3.07 0 00-1.038-.182z"/>
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
            <div className="mt-4">
              <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]/45">
                Або напишіть у месенджер
              </p>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackEvent({ name: "telegram_clicked", source: `modal_${source}` }); onClose(); }}
                  className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#29A8EB]/10 px-3 py-3.5 text-[#0088CC] transition-colors hover:bg-[#29A8EB]/20"
                >
                  <TelegramIcon />
                  <span className="text-[12px] font-semibold">Telegram</span>
                </a>
                <a
                  href={CONTACTS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackEvent({ name: "whatsapp_clicked", source: `modal_${source}` }); onClose(); }}
                  className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#25D366]/10 px-3 py-3.5 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                >
                  <WhatsAppIcon />
                  <span className="text-[12px] font-semibold">WhatsApp</span>
                </a>
                <a
                  href={CONTACTS.viber}
                  onClick={() => { trackEvent({ name: "viber_clicked", source: `modal_${source}` }); onClose(); }}
                  className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#7360F2]/10 px-3 py-3.5 text-[#7360F2] transition-colors hover:bg-[#7360F2]/20"
                >
                  <ViberIcon />
                  <span className="text-[12px] font-semibold">Viber</span>
                </a>
              </div>
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
              Виїзд адвоката на ТЦК — від 7 500 грн. Ціни фіксовані.
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
