"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { COMPANY, CONTACTS } from "@/lib/constants";
import { LeadForm } from "@/components/shared/LeadForm";

type PriceCat = "all" | "b2c" | "b2b" | "sos" | "ai";

const SERVICES_PRICES = [
  {
    cat: "ai" as PriceCat,
    icon: Sparkles,
    slug: "ai-diagnostyka",
    title: "AI-Діагностика справи",
    desc: "Інтерактивна попередня діагностика за 5–10 хв. Персональний PDF-звіт, карта ризиків, рекомендації адвоката.",
    price: "1 200 грн",
    note: "одноразово",
    badge: "Найпопулярніше",
  },
  {
    cat: "b2c" as PriceCat,
    icon: Shield,
    slug: "antyshtraf-tck-360",
    title: "Антиштраф ТЦК 360°",
    desc: "Оскарження постанови ТЦК під ключ. Включає досудове та судове провадження.",
    price: "від 8 000 грн",
    note: "під ключ",
    badge: null,
  },
  {
    cat: "b2c" as PriceCat,
    icon: FileCheck,
    slug: "vlk-pro",
    title: "ВЛК Pro",
    desc: "Повне оскарження висновку ВЛК. Медична документація + адміністративний суд.",
    price: "від 14 000 грн",
    note: "під ключ",
    badge: null,
  },
  {
    cat: "b2c" as PriceCat,
    icon: Users,
    slug: "tck-suprovid",
    title: "Супровід ТЦК",
    desc: "1 візит адвоката до ТЦК + 14 діб консультаційного супроводу. Захист на місці.",
    price: "від 5 000 грн",
    note: "1 відвідування",
    badge: null,
  },
  {
    cat: "b2c" as PriceCat,
    icon: Gavel,
    slug: "szch-zahyst",
    title: "Захист по СЗЧ",
    desc: "Кримінальний захист за ст. 407 ККУ. Адвокат у справі від першого допиту до вироку.",
    price: "від 30 000 грн",
    note: "до закриття справи",
    badge: null,
  },
  {
    cat: "sos" as PriceCat,
    icon: Phone,
    slug: "sos-24-7",
    title: "SOS 24/7",
    desc: "Цілодобова гаряча лінія + виїзд адвоката. Реакція до 30 хвилин у межах міста.",
    price: "від 1 500 грн",
    note: "за виклик",
    badge: "Цілодобово",
  },
  {
    cat: "b2b" as PriceCat,
    icon: Building2,
    slug: "b2b-bronyuvannya",
    title: "B2B Бронювання",
    desc: "Аналіз критичності + пакетне бронювання співробітників. Для компаній від 5 осіб.",
    price: "від 50 000 грн",
    note: "пакет / міс",
    badge: "Для бізнесу",
  },
];

const SOS_PACKAGES = [
  { name: "Нічний дзвінок", desc: "Телефонна консультація 20 хв вночі (22:00–08:00)", price: "1 500 грн" },
  { name: "Виїзд у ТЦК", desc: "Виїзд адвоката на виклик у ТЦК / КПП / фільтраційний пункт", price: "8 000 грн" },
  { name: "Затримання", desc: "Термінові дії при затриманні — від заяви про захисника до звільнення", price: "10 000 грн" },
  { name: "Місячний абонемент SOS", desc: "Необмежені дзвінки + 2 виїзди на місяць в межах міста", price: "24 000 грн / міс" },
];

const B2B_PACKAGES = [
  {
    name: "Бізнес-100",
    desc: "До 100 співробітників. Критичність + бронювання + щомісячний звіт.",
    price: "від 50 000 грн / міс",
    highlight: false,
  },
  {
    name: "Корпоративний",
    desc: "100+ співробітників. Повна підтримка, гарячий адвокат, SOS виїзди.",
    price: "від 250 000 грн / міс",
    highlight: true,
  },
  {
    name: "Premium індивідуальний",
    desc: "Особистий адвокат-ретейнер для топ-менеджера або власника. Конфіденційно.",
    price: "за запитом",
    highlight: false,
  },
];

const COMPARISON = [
  { item: "AI-Діагностика (15 хв)", legar: "1 200 грн", market: "3 000–8 000 грн", save: "до 85%" },
  { item: "Антиштраф ТЦК", legar: "від 8 000 грн", market: "15 000–40 000 грн", save: "до 70%" },
  { item: "ВЛК Pro", legar: "від 14 000 грн", market: "25 000–60 000 грн", save: "до 75%" },
  { item: "Захист по СЗЧ", legar: "від 30 000 грн", market: "50 000–120 000 грн", save: "до 75%" },
  { item: "SOS виклик", legar: "від 1 500 грн", market: "2 500–6 000 грн", save: "до 85%" },
  { item: "B2B пакет / 10 осіб", legar: "від 50 000 грн", market: "130 000–200 000 грн", save: "до 65%" },
];

const INCLUDED = [
  "Персональний адвокат НААУ зі спеціалізацією у військовому праві",
  "Підготовка всіх документів і клопотань",
  "Представництво у ТЦК, ВЛК, суді",
  "Зашифрований особистий кабінет із хронологією справи",
  "Telegram-чат для оперативного зв'язку",
  "Звіти про прогрес у реальному часі",
];

const PAYMENT_METHODS = [
  { icon: CreditCard, title: "Картка Visa / MC", desc: "Оплата онлайн через безпечний шлюз" },
  { icon: Banknote, title: "IBAN / переказ", desc: "Рахунок ФОП, закрита квитанція" },
  { icon: Smartphone, title: "Apple Pay / Google Pay", desc: "Миттєва оплата зі смартфона" },
  { icon: Shield, title: "Installment (частинами)", desc: "Розбити суму на 3–12 платежів (Monobank)" },
];

const PRICE_FAQ = [
  {
    q: "Чому ціни фіксовані, а не погодинні?",
    a: "Погодинна оплата створює невизначеність для клієнта. LEGAR пропонує фіксований пакет «під ключ» — ви знаєте вартість до початку роботи. Якщо справа складніша за стандарт, адвокат узгоджує доплату заздалегідь.",
  },
  {
    q: "Коли оплачувати — до чи після результату?",
    a: "Оплата поетапна: 50% після підписання договору з адвокатом, решта — після завершення справи. Для AI-Діагностики оплата повна одразу (1 200 грн).",
  },
  {
    q: "Чи є гарантія повернення коштів?",
    a: "Якщо адвокат не виконав зобов'язань із договору, LEGAR ініціює повернення відповідної частини. Умови прописані в Договорі публічної оферти на сайті.",
  },
  {
    q: "Чи можна отримати знижку?",
    a: "Так: повторні клієнти отримують 10%, реферальна програма дає 5–15% знижки обом сторонам. B2B клієнтам — індивідуальні умови.",
  },
  {
    q: "Як платити, якщо я за кордоном?",
    a: "Міжнародна картка Visa/Mastercard або IBAN — усе підтримується. LEGAR — ФОП на українській юрисдикції, рахунок у гривнях.",
  },
];

function PriceFAQItem({ q, a }: { q: string; a: string }) {
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
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-[var(--color-bg-300)] pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
};

const CATS: { id: PriceCat; label: string }[] = [
  { id: "all", label: "Усі ціни" },
  { id: "b2c", label: "Для фізосіб" },
  { id: "ai", label: "AI-Послуги" },
  { id: "sos", label: "SOS 24/7" },
  { id: "b2b", label: "B2B / Бізнес" },
];

export default function PricesPage() {
  const [cat, setCat] = useState<PriceCat>("all");

  const filtered =
    cat === "all"
      ? SERVICES_PRICES
      : SERVICES_PRICES.filter((s) => s.cat === cat);

  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="bg-[var(--color-ink)] text-white pt-20 pb-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Shield size={14} />
            Фіксовані ціни без прихованих платежів
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Усі ціни LEGAR в одній таблиці
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Знайте вартість до початку роботи. Жодних погодинних сюрпризів — лише прозорі пакети «під ключ».
          </p>
          <Link
            href="/poslugy/ai-diagnostyka"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] font-bold text-base px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            <Sparkles size={18} />
            Дізнатись ціну для моєї ситуації
          </Link>
        </div>
      </section>

      {/* ── FILTER ── */}
      <section className="sticky top-0 z-20 bg-white border-b border-[var(--color-bg-300)] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CATS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCat(id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                cat === id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-200)] text-gray-600 hover:bg-[var(--color-bg-300)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── MAIN PRICE TABLE ── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-4">
          {filtered.map(({ icon: Icon, slug, title, desc, price, note, badge }) => (
            <div
              key={slug}
              className="flex flex-col md:flex-row md:items-center gap-4 bg-white border border-[var(--color-bg-300)] rounded-2xl p-5 hover:shadow-[var(--shadow-card-hover)] transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-bg-200)] flex items-center justify-center">
                <Icon size={22} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[var(--color-ink)]">{title}</h3>
                  {badge && (
                    <span className="text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-ink)] px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[var(--color-primary)]">{price}</div>
                  <div className="text-xs text-gray-400">{note}</div>
                </div>
                <Link
                  href={`/poslugy/${slug}`}
                  className="bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Деталі →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOS PACKAGES ── */}
      {(cat === "all" || cat === "sos") && (
        <section className="bg-[var(--color-bg-200)] py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Phone size={24} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">SOS-пакети 24/7</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOS_PACKAGES.map(({ name, desc, price }) => (
                <div key={name} className="bg-white rounded-2xl p-5 border border-[var(--color-bg-300)]">
                  <p className="font-bold text-[var(--color-ink)] mb-2">{name}</p>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
                  <p className="text-lg font-extrabold text-[var(--color-primary)]">{price}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                LEGAR — інформаційно-консультаційна платформа. SOS-послуги надаються адвокатами-партнерами НААУ
                в рамках договору між клієнтом та адвокатом.
              </span>
            </p>
          </div>
        </section>
      )}

      {/* ── B2B PACKAGES ── */}
      {(cat === "all" || cat === "b2b") && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Building2 size={24} className="text-[var(--color-primary)]" />
              <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">B2B-пакети для бізнесу</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {B2B_PACKAGES.map(({ name, desc, price, highlight }) => (
                <div
                  key={name}
                  className={`rounded-2xl p-6 border-2 ${
                    highlight
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-bg-300)] bg-white text-[var(--color-ink)]"
                  }`}
                >
                  {highlight && (
                    <span className="inline-block text-xs font-bold bg-[var(--color-accent)] text-[var(--color-ink)] px-3 py-1 rounded-full mb-3">
                      Найвигідніший
                    </span>
                  )}
                  <h3 className="text-lg font-extrabold mb-2">{name}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${highlight ? "text-blue-100" : "text-gray-500"}`}>
                    {desc}
                  </p>
                  <p className={`text-xl font-extrabold mb-5 ${highlight ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"}`}>
                    {price}
                  </p>
                  <Link
                    href="/poslugy/b2b-bronyuvannya"
                    className={`block text-center text-sm font-bold py-2.5 rounded-xl transition-opacity hover:opacity-90 ${
                      highlight
                        ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                        : "bg-[var(--color-primary)] text-white"
                    }`}
                  >
                    Дізнатись більше
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MARKET COMPARISON ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-2">
            LEGAR vs. ринок: порівняння цін
          </h2>
          <p className="text-gray-500 mb-8">Середня вартість тих самих послуг у приватних адвокатів Києва (дані за 2024–2025 рр.)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-300)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-ink)] rounded-tl-xl">Послуга</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary)]">LEGAR</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Ринок</th>
                  <th className="px-4 py-3 font-semibold text-green-600 rounded-tr-xl">Економія</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ item, legar, market, save }, i) => (
                  <tr key={item} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-200)]"}>
                    <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{item}</td>
                    <td className="px-4 py-3 text-center font-bold text-[var(--color-primary)]">{legar}</td>
                    <td className="px-4 py-3 text-center text-gray-400 line-through">{market}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-0.5 rounded-full">
                        {save}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Що входить у кожен пакет LEGAR
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Способи оплати
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAYMENT_METHODS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 text-center border border-[var(--color-bg-300)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-200)] flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-[var(--color-primary)]" />
                </div>
                <p className="font-bold text-[var(--color-ink)] text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Гарантії LEGAR
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Фіксована ціна",
                desc: "Вартість узгоджується до початку роботи і не змінюється без вашої згоди.",
              },
              {
                title: "Зрозумілий договір",
                desc: "Простий договір між клієнтом та адвокатом. Жодних прихованих пунктів.",
              },
              {
                title: "Повернення за невиконання",
                desc: "Якщо адвокат не виконав зобов'язань — LEGAR допомагає повернути відповідну частину оплати.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-[var(--color-bg-200)] rounded-2xl p-6">
                <CheckCircle2 size={28} className="text-[var(--color-success)] mb-3" />
                <h3 className="font-extrabold text-[var(--color-ink)] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Питання про ціни
          </h2>
          <div className="space-y-3">
            {PRICE_FAQ.map(({ q, a }) => (
              <PriceFAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[var(--color-primary)] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Дізнайтесь ціну для вашої ситуації за 5 хвилин</h2>
          <p className="text-blue-100 mb-8">
            AI-Діагностика за 1 200 грн проаналізує вашу справу і покаже точну вартість захисту.
          </p>
          <div className="mx-auto max-w-[640px] mt-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <LeadForm variant="compact" source="tsiny-page" />
            </div>
            <div className="mt-5 text-center">
              <a
                href={CONTACTS.phoneTel}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white transition-colors hover:text-[var(--color-accent)]"
              >
                <Phone size={18} />
                {CONTACTS.phone}
              </a>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-blue-200">
            * LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.
          </p>
        </div>
      </section>
    </main>
  );
}
