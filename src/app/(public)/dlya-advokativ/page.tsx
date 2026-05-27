"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Shield,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  Send,
  Phone,
  Sparkles,
  Award,
  Lock,
  Star,
} from "lucide-react";
import { lawyerApplicationSchema, type LawyerApplicationValues } from "@/lib/validations";
import { CONTACTS } from "@/lib/constants";

const USPS = [
  {
    icon: TrendingUp,
    title: "Стабільний потік клієнтів",
    desc: "LEGAR щомісяця направляє 15–40 верифікованих клієнтів кожному активному партнеру — без холодних дзвінків та реклами.",
  },
  {
    icon: Lock,
    title: "Захищений кабінет",
    desc: "Ведення справи в цифровому кабінеті: документи, хронологія, комунікація з клієнтом. Менше адміністративної роботи — більше практики.",
  },
  {
    icon: Users,
    title: "Мережа та розвиток",
    desc: "Закрита спільнота адвокатів-партнерів, обмін кейсами, доступ до бази прецедентів LEGAR та регулярні навчальні вебінари.",
  },
  {
    icon: Shield,
    title: "Репутаційний захист",
    desc: "LEGAR бере на себе комунікацію з клієнтом, адміністрування та скарги. Ви займаєтесь виключно юридичною роботою.",
  },
];

const EARNINGS = [
  { service: "AI-Діагностика (відгук)", rate: "300 грн", type: "за консультацію" },
  { service: "Антиштраф ТЦК 360°", rate: "4 500–7 000 грн", type: "per справу" },
  { service: "ВЛК Pro", rate: "8 000–12 000 грн", type: "per справу" },
  { service: "Супровід ТЦК (1 візит)", rate: "2 500–3 500 грн", type: "per відвідування" },
  { service: "Захист по СЗЧ", rate: "18 000–24 000 грн", type: "до закриття" },
  { service: "SOS 24/7 (виклик)", rate: "4 000–6 000 грн", type: "за виїзд" },
  { service: "B2B абонемент", rate: "від 8% контракту", type: "щомісяця" },
];

const COMPARISON = [
  { criterion: "Джерело клієнтів", legar: "Платформа направляє верифікованих", market: "Самостійно (соцмережі, знайомі)" },
  { criterion: "Адміністрування", legar: "Автоматизовано (кабінет, CRM)", market: "Вручну або найняти помічника" },
  { criterion: "Маркетинг", legar: "Не потрібен", market: "Витрати 15–30% доходу" },
  { criterion: "Звітність та договори", legar: "Шаблони LEGAR", market: "Самостійно" },
  { criterion: "Захист репутації", legar: "LEGAR управляє відгуками", market: "На свій розсуд" },
];

const ONBOARDING = [
  { step: "01", text: "Заповнюєте заявку нижче — вказуєте спеціалізацію та досвід" },
  { step: "02", text: "Менеджер LEGAR перевіряє свідоцтво НААУ (до 2 робочих днів)" },
  { step: "03", text: "Онлайн-співбесіда (30 хвилин) — стандарти та формат роботи" },
  { step: "04", text: "Підписання партнерської угоди та доступ до кабінету" },
  { step: "05", text: "Перший клієнт надходить упродовж 7 днів після активації" },
];

const PARTNER_FAQ = [
  {
    q: "Чи можу я залишатись незалежним адвокатом, а не йти в штат?",
    a: "Так. LEGAR співпрацює з адвокатами як незалежними партнерами (підрядниками). Ви зберігаєте повну незалежність, свій бізнес та клієнтів. Договір — між вами та клієнтом, LEGAR — платформа.",
  },
  {
    q: "Які вимоги до спеціалізації?",
    a: "Мінімум 3 роки практики. Спеціалізація: військове право, адміністративне право (оскарження держрішень), кримінальне право (бажано), або медичне право (для ВЛК-напрямку). Є досвід у мобілізаційній темі — великий плюс.",
  },
  {
    q: "Скільки часу потрібно приділяти?",
    a: "Залежить від вашого бажання. Мінімум: 5 справ на місяць (приблизно 10–15 годин). Максимум — не обмежений. Ми підлаштовуємо потік клієнтів під вашу доступність.",
  },
  {
    q: "Як відбувається оплата від клієнта?",
    a: "Клієнт оплачує LEGAR, ми переказуємо вашу частину після завершення або поетапно (залежно від угоди). Виплата — раз на тиждень або за фактом закриття справи. Ніяких затримок.",
  },
  {
    q: "Чи є навчання для нових партнерів?",
    a: "Так. Онлайн-онбординг (3 відео, 2 години), закрита база прецедентів LEGAR, щомісячні вебінари з провідними адвокатами мережі. Для нових партнерів — куратор на перші 30 днів.",
  },
  {
    q: "Що якщо я не хочу продовжувати співпрацю?",
    a: "Вихід будь-коли без штрафів. Активні справи завершуєте або передаєте за спільним погодженням з клієнтом. Доступ до кабінету закривається після передачі справ.",
  },
  {
    q: "Чи є ексклюзивність по регіонах?",
    a: "Не строга. У кожному місті може бути 5–10 активних партнерів. Розподіл клієнтів залежить від спеціалізації, рейтингу та завантаженості адвоката.",
  },
  {
    q: "Чи потрібно платити за вступ або ліцензію?",
    a: "Ні. Вступ безкоштовний. LEGAR заробляє відсоток від кожної успішно завершеної справи — зацікавленість в результаті обопільна.",
  },
];

const SPECS = [
  "Військове право",
  "Адміністративне право",
  "Кримінальне право",
  "Медичне право (ВЛК)",
  "Конституційне право",
  "Цивільне право",
];

function PartnerFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--color-bg-300)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--color-bg-200)] transition-colors"
      >
        <span className="font-semibold text-[var(--color-ink)] pr-4">{q}</span>
        <ChevronDown
          size={20}
          className={`text-[var(--color-primary)] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-[var(--color-bg-300)] pt-4 text-sm">
          {a}
        </div>
      )}
    </div>
  );
}

export default function DlyaAdvokativPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LawyerApplicationValues>({
    resolver: zodResolver(lawyerApplicationSchema),
    defaultValues: {
      specializations: [],
      has_military_practice: false,
      consent: true,
    },
  });

  const selectedSpecs = watch("specializations") ?? [];

  async function onSubmit(data: LawyerApplicationValues) {
    try {
      const res = await fetch("/api/lawyer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("server error");
      setSubmitted(true);
      toast.success("Заявку надіслано! Менеджер зв'яжеться впродовж 2 робочих днів.");
    } catch {
      toast.error("Помилка надсилання. Спробуйте ще раз або зателефонуйте.");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="bg-[var(--color-ink)] text-white pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white">Головна</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Для адвокатів</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            <Award size={14} />
            Тільки адвокати НААУ
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-3xl">
            Приєднайтесь до партнерської мережі LEGAR
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mb-8">
            Стабільний потік клієнтів у сфері військового права, цифровий кабінет для ведення справ
            та гідна оплата без маркетингових витрат.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#application-form"
              className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Send size={18} />
              Подати заявку
            </a>
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Phone size={18} />
              Запитати деталі
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[var(--color-primary)] py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "47", label: "активних партнерів" },
            { value: "5 000+", label: "справ закрито" },
            { value: "15–40", label: "клієнтів на місяць" },
            { value: "2 дні", label: "до першого клієнта" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center text-white">
              <div className="text-3xl font-extrabold text-[var(--color-accent)] mb-1">{value}</div>
              <div className="text-sm text-blue-100">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── USPs ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-2 text-center">
            Чому адвокати обирають LEGAR
          </h2>
          <p className="text-gray-500 text-center mb-10">Більше практики, менше адміністрування</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {USPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-[var(--color-bg-200)] rounded-2xl p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Icon size={22} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[var(--color-ink)] mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS TABLE ── */}
      <section className="bg-[var(--color-bg-200)] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-2">
            Скільки заробляє партнер LEGAR
          </h2>
          <p className="text-gray-500 mb-8">Орієнтовні виплати по кожному напрямку</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-300)]">
                  <th className="text-left px-5 py-3 font-semibold text-[var(--color-ink)] rounded-tl-xl">Послуга</th>
                  <th className="px-5 py-3 font-semibold text-[var(--color-primary)] text-right">Виплата адвокату</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 text-right rounded-tr-xl">Тип</th>
                </tr>
              </thead>
              <tbody>
                {EARNINGS.map(({ service, rate, type }, i) => (
                  <tr key={service} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-200)]"}>
                    <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{service}</td>
                    <td className="px-5 py-3 text-right font-bold text-[var(--color-primary)]">{rate}</td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs">{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            * Суми залежать від складності справи та домовленостей. Середнє навантаження — 15 справ/міс.
            Потенційний місячний дохід: 60 000–180 000 грн.
          </p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            LEGAR vs. самостійна практика
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-200)]">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 rounded-tl-xl">Критерій</th>
                  <th className="px-5 py-3 font-semibold text-[var(--color-primary)] rounded-none">Партнер LEGAR</th>
                  <th className="px-5 py-3 font-semibold text-gray-400 rounded-tr-xl">Самостійно</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ criterion, legar, market }, i) => (
                  <tr key={criterion} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-200)]"}>
                    <td className="px-5 py-3 text-gray-500 font-medium">{criterion}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                        <CheckCircle2 size={14} />
                        {legar}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-400">{market}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ONBOARDING STEPS ── */}
      <section className="bg-[var(--color-bg-200)] py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-2 text-center">
            Як стати партнером
          </h2>
          <p className="text-gray-500 text-center mb-10">5 кроків від заявки до першого клієнта</p>
          <div className="relative pl-10">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-bg-300)]" />
            <div className="space-y-6">
              {ONBOARDING.map(({ step, text }) => (
                <div key={step} className="relative">
                  <div className="absolute -left-6 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-extrabold flex items-center justify-center">
                    {step}
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-2">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-gray-500">
            <Clock size={16} className="text-[var(--color-primary)]" />
            Від подання заявки до першого клієнта — зазвичай 5–7 робочих днів
          </div>
        </div>
      </section>

      {/* ── PROFILE MOCKUP ── */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-4">
              Ваш профіль у мережі LEGAR
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Кожен партнер отримує верифікований профіль на платформі. Клієнти бачать ваш досвід,
              спеціалізацію та реальні відгуки — і довіряють ще до першої розмови.
            </p>
            <ul className="space-y-2">
              {[
                "Верифікована позначка НААУ",
                "Рейтинг на основі відгуків",
                "Спеціалізації та досвід",
                "Статистика закритих справ",
                "Міста присутності",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-[var(--color-success)] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-bg-200)] rounded-2xl p-6 border border-[var(--color-bg-300)]">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white font-extrabold text-xl">
                А
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[var(--color-ink)]">Олена Коваль</h3>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">НААУ ✓</span>
                </div>
                <p className="text-sm text-gray-500">Адвокат LEGAR · Київ</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">4.9 (38 відгуків)</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1 mb-4">
              <p><strong className="text-gray-700">Спеціалізація:</strong> ТЦК, ВЛК, СЗЧ</p>
              <p><strong className="text-gray-700">Стаж:</strong> 8 років</p>
              <p><strong className="text-gray-700">Справ закрито:</strong> 127</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-center">
              <div className="bg-white rounded-xl p-2 border border-[var(--color-bg-300)]">
                <div className="font-extrabold text-[var(--color-primary)] text-lg">94%</div>
                <div className="text-gray-400">успішних справ</div>
              </div>
              <div className="bg-white rounded-xl p-2 border border-[var(--color-bg-300)]">
                <div className="font-extrabold text-[var(--color-primary)] text-lg">2 год</div>
                <div className="text-gray-400">середня реакція</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Питання партнерів
          </h2>
          <div className="space-y-3">
            {PARTNER_FAQ.map(({ q, a }) => (
              <PartnerFaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="application-form" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[var(--color-ink)] mb-3">
              Заявка на партнерство
            </h2>
            <p className="text-gray-600">
              Заповніть форму — менеджер LEGAR зв'яжеться впродовж 2 робочих днів
            </p>
          </div>

          {submitted ? (
            <div className="bg-[var(--color-bg-200)] rounded-3xl p-10 text-center border border-[var(--color-bg-300)]">
              <CheckCircle2 size={56} className="text-[var(--color-success)] mx-auto mb-4" />
              <h3 className="text-2xl font-extrabold text-[var(--color-ink)] mb-3">
                Заявку отримано!
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Менеджер LEGAR перевіряє вашу заявку і зв'яжеться впродовж 2 робочих днів
                для короткої онлайн-зустрічі (30 хв).
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-[var(--color-bg-200)] rounded-3xl p-8 border border-[var(--color-bg-300)] space-y-6"
            >
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                  ПІБ *
                </label>
                <input
                  {...register("full_name")}
                  placeholder="Прізвище Ім'я По батькові"
                  className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                    E-mail *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                    Телефон *
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="0XXXXXXXXX"
                    className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* City + NAAU */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                    Місто роботи *
                  </label>
                  <input
                    {...register("city")}
                    placeholder="Київ"
                    className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                    № свідоцтва НААУ *
                  </label>
                  <input
                    {...register("naau_certificate")}
                    placeholder="12345/21"
                    className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  {errors.naau_certificate && <p className="text-red-500 text-xs mt-1">{errors.naau_certificate.message}</p>}
                </div>
              </div>

              {/* Years practice */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                  Років практики *
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  {...register("years_practice", { valueAsNumber: true })}
                  placeholder="5"
                  className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                {errors.years_practice && <p className="text-red-500 text-xs mt-1">{errors.years_practice.message}</p>}
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
                  Спеціалізація (оберіть усі підходящі) *
                </label>
                <Controller
                  control={control}
                  name="specializations"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {SPECS.map((spec) => {
                        const isSelected = (field.value ?? []).includes(spec);
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => {
                              const current = field.value ?? [];
                              if (isSelected) {
                                field.onChange(current.filter((s) => s !== spec));
                              } else {
                                field.onChange([...current, spec]);
                              }
                            }}
                            className={`text-sm px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                              isSelected
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-white text-gray-600 border-[var(--color-bg-300)] hover:border-[var(--color-primary)]"
                            }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {spec}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.specializations && (
                  <p className="text-red-500 text-xs mt-1">{errors.specializations.message}</p>
                )}
              </div>

              {/* Monthly capacity */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                  Кількість справ на місяць (орієнтовно)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  {...register("monthly_capacity", { valueAsNumber: true })}
                  placeholder="10"
                  className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              {/* Military practice checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="has_military"
                  {...register("has_military_practice")}
                  className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="has_military" className="text-sm text-gray-700">
                  Маю досвід у справах по мобілізації / ТЦК / ВЛК / СЗЧ
                </label>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                  Додатковий коментар
                </label>
                <textarea
                  {...register("comment")}
                  rows={3}
                  placeholder="Розкажіть про свій досвід, найбільш резонансні справи або запитайте про умови"
                  className="w-full border border-[var(--color-bg-300)] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
              </div>

              {/* Consent */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consent-lawyer"
                  {...register("consent")}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="consent-lawyer" className="text-xs text-gray-500 leading-relaxed">
                  Погоджуюсь з{" "}
                  <Link href="/legal/pryvatnist" className="text-[var(--color-primary)] hover:underline">
                    Політикою конфіденційності
                  </Link>{" "}
                  та даю згоду на обробку персональних даних для розгляду заявки
                </label>
              </div>
              {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting || selectedSpecs.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Send size={18} />
                {isSubmitting ? "Надсилання…" : "Надіслати заявку"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[var(--color-primary)] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-2xl font-extrabold mb-3">Залишились питання?</h2>
          <p className="text-blue-100 mb-6">
            Зателефонуйте — менеджер партнерської програми відповість на всі запитання.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              {CONTACTS.phone}
            </a>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Sparkles size={18} />
              FAQ для партнерів
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            * LEGAR — інформаційно-консультаційна платформа. Партнерські угоди укладаються з адвокатами НААУ.
          </p>
        </div>
      </section>
    </main>
  );
}
