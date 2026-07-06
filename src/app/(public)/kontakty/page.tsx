"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  Building2,
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import {
  TelegramIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations";
import { COMPANY, CONTACTS, CITIES, SERVICES } from "@/lib/constants";

type InquiryType = "general" | "tck" | "vlk" | "szch" | "sos" | "b2b";

const INQUIRY_TYPES: { id: InquiryType; label: string }[] = [
  { id: "general", label: "Загальне питання" },
  { id: "tck", label: "Проблема з ТЦК" },
  { id: "vlk", label: "Оскарження ВЛК" },
  { id: "szch", label: "СЗЧ / ст. 407 ККУ" },
  { id: "sos", label: "SOS — термінова допомога" },
  { id: "b2b", label: "B2B / Бронювання компанії" },
];

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Гаряча лінія",
    primary: CONTACTS.phone,
    secondary: "Безкоштовно по Україні",
    href: CONTACTS.phoneTel,
    cta: "Зателефонувати",
    badge: "24/7",
  },
  {
    icon: TelegramIcon,
    title: "Telegram-канал",
    primary: CONTACTS.telegramChannelHandle,
    secondary: "Новини, поради, кейси LEGAR",
    href: CONTACTS.telegramChannel,
    cta: "Підписатися",
    badge: "Канал",
  },
  {
    icon: Mail,
    title: "E-mail",
    primary: CONTACTS.email,
    secondary: "Для офіційних запитів та документів",
    href: `mailto:${CONTACTS.email}`,
    cta: "Написати листа",
    badge: null,
  },
];

const BUSINESS_HOURS = [
  { day: "Понеділок – П'ятниця", time: "09:00 – 20:00" },
  { day: "Субота", time: "10:00 – 17:00" },
  { day: "Неділя", time: "Вихідний" },
  { day: "SOS-лінія", time: "24/7 без вихідних" },
];

const MESSENGERS = [
  { icon: TelegramIcon, label: "Telegram-канал", handle: CONTACTS.telegramChannelHandle, href: CONTACTS.telegramChannel },
];

const SOCIAL = [
  { icon: InstagramIcon, label: "Instagram", href: CONTACTS.instagram },
  { icon: YoutubeIcon, label: "YouTube", href: CONTACTS.youtube },
  { icon: FacebookIcon, label: "Facebook", href: CONTACTS.facebook },
];

export default function KontaktyPage() {
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      consent: true,
    },
  });

  async function onSubmit(data: LeadFormValues) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, inquiry_type: inquiryType }),
      });
      if (!res.ok) throw new Error("server error");
      setSubmitted(true);
      reset();
      toast.success("Повідомлення надіслано! Зв'яжемося впродовж 2 годин.");
    } catch {
      toast.error("Помилка. Спробуйте ще раз або зателефонуйте.");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="bg-[var(--color-ink)] text-white pt-20 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white">Головна</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Контакти</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Зв'яжіться з LEGAR
          </h1>
          <p className="text-xl text-gray-300 max-w-xl">
            Гаряча лінія, Telegram, e-mail. SOS-реакція 24/7.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONTACT_CARDS.map(({ icon: Icon, title, primary, secondary, href, cta, badge }) => (
            <div key={title} className="bg-[var(--color-bg-200)] rounded-2xl p-6 border border-[var(--color-bg-300)]">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Icon size={20} className="text-[var(--color-primary)]" />
                </div>
                {badge && (
                  <span className="text-xs font-bold bg-[var(--color-accent)] text-[var(--color-ink)] px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-1">{title}</p>
              <p className="font-extrabold text-[var(--color-ink)] mb-1">{primary}</p>
              <p className="text-xs text-gray-500 mb-4">{secondary}</p>
              {href && cta && (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-block w-full text-center text-sm font-bold bg-[var(--color-primary)] text-white py-2 rounded-xl hover:opacity-90 transition-opacity"
                >
                  {cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + SIDE INFO ── */}
      <section className="bg-[var(--color-bg-200)] py-14 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* FORM */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-6">
              Надіслати звернення
            </h2>

            {submitted ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[var(--color-bg-300)]">
                <CheckCircle2 size={48} className="text-[var(--color-success)] mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-[var(--color-ink)] mb-2">
                  Повідомлення отримано!
                </h3>
                <p className="text-gray-600">
                  Менеджер LEGAR зв'яжеться з вами впродовж 2 годин.
                  Для термінових питань — зателефонуйте на гарячу лінію.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 border border-[var(--color-bg-300)] space-y-5">
                {/* Inquiry type */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
                    Тип звернення
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INQUIRY_TYPES.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setInquiryType(id)}
                        className={`text-sm px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          inquiryType === id
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-bg-200)] text-gray-600 hover:bg-[var(--color-bg-300)]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                    Ім'я *
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Як до вас звертатись"
                    className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                      Телефон *
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="0XXXXXXXXX"
                      className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                      E-mail
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="example@mail.com"
                      className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                </div>

                {/* City + Service */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                      Місто
                    </label>
                    <select
                      {...register("city")}
                      className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                    >
                      <option value="">Оберіть місто</option>
                      {CITIES.map((c) => (
                        <option key={c.slug} value={c.nameUk}>{c.nameUk}</option>
                      ))}
                      <option value="Інше">Інше місто</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                      Послуга
                    </label>
                    <select
                      {...register("service")}
                      className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                    >
                      <option value="">Оберіть послугу</option>
                      {SERVICES.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.shortTitle}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                    Опишіть ситуацію *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Що сталось? Коли? Які документи є? Чим можемо допомогти?"
                    className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Consent */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    id="consent-contacts"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="consent-contacts" className="text-xs text-gray-500 leading-relaxed">
                    Погоджуюсь з{" "}
                    <Link href="/legal/pryvatnist" className="text-[var(--color-primary)] hover:underline">
                      Політикою конфіденційності
                    </Link>{" "}
                    і{" "}
                    <Link href="/legal/zgoda-pd" className="text-[var(--color-primary)] hover:underline">
                      Згодою на обробку ПД
                    </Link>
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-red-500 text-xs">{errors.consent.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  <Send size={18} />
                  {isSubmitting ? "Надсилання…" : "Надіслати звернення"}
                </button>
              </form>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--color-bg-300)]">
              <h3 className="font-extrabold text-[var(--color-ink)] mb-4">Графік роботи</h3>
              <div className="space-y-2">
                {BUSINESS_HOURS.map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-500">{day}</span>
                    <span className={`font-semibold ${time === "24/7 без вихідних" ? "text-green-600" : "text-[var(--color-ink)]"}`}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messengers */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--color-bg-300)]">
              <h3 className="font-extrabold text-[var(--color-ink)] mb-4">Месенджери</h3>
              <div className="space-y-2">
                {MESSENGERS.map(({ icon: Icon, label, handle, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={label !== "Viber" ? "_blank" : undefined}
                    rel={label !== "Viber" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[var(--color-bg-200)] transition-colors"
                  >
                    <Icon size={18} className="text-[var(--color-primary)]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700">{label}</span>
                      <span className="text-xs text-gray-400">{handle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--color-bg-300)]">
              <h3 className="font-extrabold text-[var(--color-ink)] mb-4">Соціальні мережі</h3>
              <div className="space-y-2">
                {SOCIAL.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[var(--color-bg-200)] transition-colors"
                  >
                    <Icon size={18} className="text-[var(--color-primary)]" />
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Legal info */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--color-bg-300)]">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-[var(--color-primary)]" />
                <h3 className="font-extrabold text-[var(--color-ink)]">Реквізити</h3>
              </div>
              <div className="text-xs text-gray-500 space-y-1 leading-relaxed">
                <p><strong className="text-gray-700">Юр. особа:</strong> {COMPANY.legalName}</p>
                <p><strong className="text-gray-700">Форма:</strong> ФОП</p>
                <p><strong className="text-gray-700">Юрисдикція:</strong> Україна</p>
                <p><strong className="text-gray-700">Сайт:</strong> {COMPANY.url}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── B2B BLOCK ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--color-ink)] rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] text-sm font-bold px-3 py-1 rounded-full mb-4">
                  <Building2 size={14} />
                  Для бізнесу
                </div>
                <h2 className="text-2xl font-extrabold mb-3">
                  Захист команди починається з одного дзвінка
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm">
                  B2B-клієнти отримують виділеного менеджера, пріоритетну лінію та індивідуальні умови.
                  Від 5 до 500+ співробітників.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/poslugy/b2b-bronyuvannya"
                  className="block text-center bg-[var(--color-accent)] text-[var(--color-ink)] font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Детальніше про B2B →
                </Link>
                <a
                  href={CONTACTS.phoneTel}
                  className="block text-center bg-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  Зателефонувати: {CONTACTS.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOS CTA ── */}
      <section className="bg-[var(--color-primary)] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-2xl font-extrabold mb-3">Термінова ситуація?</h2>
          <p className="text-blue-100 mb-6">
            Затримання, обшук, повістка сьогодні — телефонуйте зараз. SOS-адвокат реагує до 30 хвилин.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              {CONTACTS.phone} — безкоштовно
            </a>
            <Link
              href="/poslugy/ai-diagnostyka"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Sparkles size={18} />
              AI-Діагностика
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            * LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.
          </p>
        </div>
      </section>
    </main>
  );
}
