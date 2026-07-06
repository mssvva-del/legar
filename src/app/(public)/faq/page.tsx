"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, Sparkles, Phone } from "lucide-react";
import { COMPANY, CONTACTS } from "@/lib/constants";
import { LeadForm } from "@/components/shared/LeadForm";

type FaqCat =
  | "all"
  | "general"
  | "services"
  | "prices"
  | "tck"
  | "vlk"
  | "szch"
  | "lawyers"
  | "process";

interface FaqItem {
  cat: FaqCat;
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  // GENERAL
  {
    cat: "general",
    q: "Що таке LEGAR і чим ви займаєтесь?",
    a: "LEGAR — перша цифрова інформаційно-консультаційна платформа військово-правового захисту в Україні. Ми з'єднуємо людей у правовій кризі з перевіреними адвокатами НААУ та забезпечуємо захищений кабінет для ведення справи. Самі юридичних послуг не надаємо — лише платформа і координація.",
  },
  {
    cat: "general",
    q: "LEGAR пов'язаний з ТЦК або державними органами?",
    a: "Ні. LEGAR — приватна платформа, зареєстрована як ФОП. Ніякого зв'язку, підпорядкування або affiliation з ТЦК, Міноборони, прокуратурою або будь-яким державним органом. Ми захищаємо виключно інтереси клієнта.",
  },
  {
    cat: "general",
    q: "Чи можна отримати консультацію анонімно?",
    a: "AI-Діагностику можна пройти без реєстрації. Для підключення адвоката потрібна ідентифікація — відповідно до вимог адвокатської таємниці та GDPR. Всі персональні дані зашифровані.",
  },
  {
    cat: "general",
    q: "Чи є LEGAR у моєму місті?",
    a: "Платформа LEGAR доступна онлайн по всій Україні. Адвокати-партнери фізично присутні у Києві, Львові, Дніпрі, Харкові та Одесі. Для інших міст — онлайн-захист та дистанційне представництво.",
  },
  // SERVICES
  {
    cat: "services",
    q: "Що входить в AI-Діагностику справи?",
    a: "Інтерактивний опитувальник (5–10 хвилин) → аналіз вашої ситуації → персональний PDF-звіт з: картою правових ризиків, рекомендованими послугами, попередньою оцінкою вартості захисту, коментарем чергового юриста. Вартість 1 200 грн.",
  },
  {
    cat: "services",
    q: "Що означає 'Антиштраф ТЦК 360°'?",
    a: "Комплексна послуга оскарження постанов ТЦК «під ключ». Включає досудову стадію (клопотання, скарги до вищих органів) і судову стадію (адміністративний суд). Адвокат займається всім — від збору документів до отримання рішення.",
  },
  {
    cat: "services",
    q: "Чим ВЛК Pro відрізняється від 'Антиштраф ТЦК'?",
    a: "Антиштраф ТЦК стосується оскарження адміністративних постанов ТЦК. ВЛК Pro — оскарження медичного висновку ВЛК про придатність до служби. Це різні органи, різні документи, різні правові підстави та інші суди. Якщо у вас обидві проблеми — підбираємо комплексний підхід.",
  },
  {
    cat: "services",
    q: "Що таке 'Захист по СЗЧ'?",
    a: "СЗЧ — самовільне залишення частини (ст. 407 ККУ) — це кримінальне правопорушення. Захист по СЗЧ — кримінальне провадження за участі адвоката: від першого допиту, підозри до вироку або закриття справи. Послуга для тих, хто вже потрапив у кримінальне провадження.",
  },
  {
    cat: "services",
    q: "Як працює SOS 24/7?",
    a: "Телефонуєте або пишете — адвокат відповідає до 30 хвилин (цілодобово). Для виїзду — адвокат прибуває на місце (ТЦК, КПП, місце затримання) у межах міста. Тарифи: нічний дзвінок від 1 500 грн, виїзд від 8 000 грн.",
  },
  // PRICES
  {
    cat: "prices",
    q: "Чому ціни у LEGAR нижчі за ринок?",
    a: "LEGAR — платформа, а не традиційна юрфірма з великим штатом і орендою офісів. Ми автоматизуємо адміністративну роботу через AI, а адвокати-партнери спеціалізуються виключно у своїй ніші. Це дає економію 50–70% від ринкової вартості при тій самій якості.",
  },
  {
    cat: "prices",
    q: "Коли і як потрібно платити?",
    a: "Для AI-Діагностики — повна оплата одразу (1 200 грн). Для послуг адвоката — поетапно: 50% авансу після підписання договору, решта — по досягненні узгодженого результату або після завершення справи.",
  },
  {
    cat: "prices",
    q: "Чи можна платити частинами (розстрочка)?",
    a: "Так. Через Monobank Installment можна розбити суму на 3–12 платежів. Умови надає банк напряму. LEGAR отримує повну суму одразу — без переплати для клієнта.",
  },
  {
    cat: "prices",
    q: "Що якщо адвокат не досяг результату?",
    a: "Якщо адвокат не виконав конкретних зобов'язань, прописаних у договорі — LEGAR ініціює розгляд і, за підтвердженням порушення, допомагає отримати часткове повернення. Умови чітко прописані в Договорі публічної оферти.",
  },
  // TCK
  {
    cat: "tck",
    q: "Отримав повістку від ТЦК — що робити?",
    a: "По-перше, не панікуйте і не ігноруйте. Зателефонуйте на гарячу лінію LEGAR або пройдіть AI-Діагностику. Ми перевіримо законність повістки, строки, підстави. Якщо є підстави для оскарження — починаємо роботу негайно.",
  },
  {
    cat: "tck",
    q: "Чи законна повістка, передана незнайомою людиною на вулиці?",
    a: "Ні — вручення повістки має відповідати вимогам Закону України «Про мобілізаційну підготовку». Повістка, передана не уповноваженою особою або без підпису, може бути визнана недійсною. Передайте нам копію — проаналізуємо безкоштовно.",
  },
  {
    cat: "tck",
    q: "Чи можна оскаржити відмову ТЦК у відстрочці?",
    a: "Так. Відстрочки надаються законом: батькам трьох і більше дітей, опікунам, людям з хворобами, підприємцям з критичною функцією та ін. Якщо ТЦК відмовив незаконно — оскаржуємо через адміністративний суд.",
  },
  // VLK
  {
    cat: "vlk",
    q: "ВЛК визнала мене придатним — що робити?",
    a: "Першим кроком — отримайте копію висновку ВЛК. Потім: незалежне медичне обстеження, збір медичних документів, подача скарги до вищої ВЛК або адміністративного суду. Адвокат LEGAR ВЛК Pro веде весь процес.",
  },
  {
    cat: "vlk",
    q: "Скільки часу займає оскарження ВЛК?",
    a: "Досудова стадія (скарга до вищої ВЛК) — 14–30 днів. Адміністративний суд першої інстанції — 1–3 місяці залежно від завантаженості суду і складності справи. LEGAR веде справу на всіх стадіях.",
  },
  // SZCH
  {
    cat: "szch",
    q: "Мені повідомили підозру за ст. 407 ККУ — що робити?",
    a: "Негайно зверніться за юридичною допомогою. Не давайте показань без адвоката. Телефонуйте на SOS-лінію LEGAR — адвокат прибуде на допит або місце затримання. Будь-яке ваше слово без захисника може бути використане проти вас.",
  },
  {
    cat: "szch",
    q: "Чи можна закрити справу по ст. 407 ККУ?",
    a: "Так, за певних умов: примирення з потерпілим (командуванням), дійове каяття, звільнення від відповідальності через зміну обставин тощо. Адвокат аналізує конкретну справу і пропонує оптимальну тактику.",
  },
  // LAWYERS
  {
    cat: "lawyers",
    q: "Хто такі адвокати LEGAR? Де підтвердження їхньої кваліфікації?",
    a: "Усі адвокати-партнери LEGAR — члени Національної Асоціації Адвокатів України (НААУ). Свідоцтво можна перевірити на офіційному сайті наау.ua. LEGAR додатково перевіряє профіль і спеціалізацію кожного партнера.",
  },
  {
    cat: "lawyers",
    q: "Чи можу я вибрати конкретного адвоката?",
    a: "Так. LEGAR показує профіль запропонованого адвоката (досвід, спеціалізація, рейтинг). Якщо не влаштовує — просите заміну. Остаточний вибір — за вами.",
  },
  {
    cat: "lawyers",
    q: "Я адвокат. Як стати партнером LEGAR?",
    a: "Переходьте на сторінку «Для адвокатів» і залиште заявку. Потрібно: свідоцтво НААУ, спеціалізація у військовому/кримінальному/адміністративному праві, стаж від 3 років.",
  },
  // PROCESS
  {
    cat: "process",
    q: "Як відстежувати хід своєї справи?",
    a: "В особистому кабінеті на legar.com.ua: хронологія всіх дій, документи, повідомлення від адвоката. Також Telegram-чат для оперативних питань. Менеджер LEGAR на зв'язку в робочий час.",
  },
  {
    cat: "process",
    q: "Чи можу я консультуватись із LEGAR, якщо я за кордоном?",
    a: "Так, повністю. AI-Діагностика, консультації, підписання договору, ведення справи — все онлайн. Адвокат представляє вас без вашої фізичної присутності в Україні (крім випадків, коли суд вимагає особистої явки).",
  },
  {
    cat: "process",
    q: "Яка конфіденційність моїх даних?",
    a: "Персональні дані зашифровані та зберігаються на захищених серверах. LEGAR не передає і не продає дані третім особам. Дотримуємось GDPR та Закону України «Про захист персональних даних». Деталі — в Політиці конфіденційності.",
  },
];

const CATS: { id: FaqCat; label: string; count?: number }[] = [
  { id: "all", label: "Всі питання" },
  { id: "general", label: "Загальне" },
  { id: "services", label: "Послуги" },
  { id: "prices", label: "Ціни і оплата" },
  { id: "tck", label: "ТЦК" },
  { id: "vlk", label: "ВЛК" },
  { id: "szch", label: "СЗЧ" },
  { id: "lawyers", label: "Адвокати" },
  { id: "process", label: "Процес" },
];

function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--color-bg-300)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--color-bg-200)] transition-colors"
      >
        <span className="font-semibold text-[var(--color-ink)] pr-4 leading-snug">{q}</span>
        <ChevronDown
          size={20}
          className={`text-[var(--color-primary)] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-[var(--color-bg-300)] pt-4 text-sm">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [cat, setCat] = useState<FaqCat>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let items = cat === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((i) => i.cat === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q));
    }
    return items;
  }, [cat, query]);

  return (
    <main className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="bg-[var(--color-ink)] text-white pt-20 pb-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <nav className="text-sm text-gray-400 mb-8 text-left">
            <Link href="/" className="hover:text-white">Головна</Link>
            <span className="mx-2">/</span>
            <span className="text-white">FAQ</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Часті питання
          </h1>
          <p className="text-gray-300 mb-8">
            {FAQ_ITEMS.length} відповідей на найпоширеніші запитання про LEGAR, адвокатів, ціни та процес
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук по питаннях і відповідях…"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white/15"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS ── */}
      <section className="sticky top-0 z-20 bg-white border-b border-[var(--color-bg-300)] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CATS.map(({ id, label }) => {
            const count = id === "all" ? FAQ_ITEMS.length : FAQ_ITEMS.filter((i) => i.cat === id).length;
            return (
              <button
                key={id}
                onClick={() => { setCat(id); setQuery(""); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  cat === id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-200)] text-gray-600 hover:bg-[var(--color-bg-300)]"
                }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${cat === id ? "bg-white/20 text-white" : "bg-[var(--color-bg-300)] text-gray-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FAQ LIST ── */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Нічого не знайдено за запитом «{query}»</p>
            <button
              onClick={() => { setQuery(""); setCat("all"); }}
              className="mt-4 text-[var(--color-primary)] font-semibold text-sm hover:underline"
            >
              Скинути фільтри
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(({ q, a }) => (
              <FaqAccordionItem key={q} q={q} a={a} />
            ))}
          </div>
        )}
      </section>

      {/* ── SCHEMA ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
                  { "@type": "ListItem", position: 2, name: "FAQ", item: `${COMPANY.url}/faq` },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: FAQ_ITEMS.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
              },
            ],
          }),
        }}
      />

      {/* ── LEAD FORM CTA ── */}
      <section className="bg-[var(--color-accent)] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-3">
              Не знайшли відповідь?
            </h2>
            <p className="text-[var(--color-ink)]/70">
              Залиште заявку — адвокат зв'яжеться протягом 15 хвилин.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <LeadForm variant="compact" source="faq-page" />
          </div>
          <div className="mt-5 text-center">
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-primary)]"
            >
              <Phone size={18} />
              {CONTACTS.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
