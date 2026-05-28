/**
 * LEGAR — централізовані константи бренду та сервісів.
 * Усі сторінки, форми та meta-дані тягнуть значення звідси.
 */

export const COMPANY = {
  name: "LEGAR",
  tagline: "ЮРИДИЧНИЙ ЩИТ",
  legalName: "ФОП Молодан Сергій Андрійович",
  description: "Перша цифрова військово-правова платформа України",
  url: "https://legar.com.ua",
} as const;

export const CONTACTS = {
  email: "mail@legar.com.ua",
  // Безкоштовна гаряча лінія
  phone: "0 800 357 288",
  phoneFormatted: "+38 (0800) 357-288",
  phoneTel: "tel:+380800357288",
  // Прямий номер (WhatsApp / Viber)
  phoneDirect: "+38 068 912 73 65",
  phoneDirectTel: "tel:+380689127365",
  // Месенджери (підтримка)
  telegram: "https://t.me/legar_ukr",
  telegramHandle: "@legar_ukr",
  whatsapp: "https://wa.me/380689127365",
  viber: "viber://chat?number=+380689127365",
  // Канал
  telegramChannel: "https://t.me/legarukr",
  telegramChannelHandle: "@legarukr",
  // Соцмережі
  instagram: "https://instagram.com/legarukr",
  youtube: "https://youtube.com/@legarukr",
  facebook: "https://facebook.com/legarukr",
  tiktok: "https://tiktok.com/@legarukr",
} as const;

export type ServiceIcon =
  | "Sparkles"
  | "Shield"
  | "FileCheck"
  | "Users"
  | "Gavel"
  | "Phone"
  | "Building2";

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  priceUah: number;
  priceLabel: string;
  icon: ServiceIcon;
  description: string;
}

export const SERVICES: Service[] = [
  {
    slug: "ai-diagnostyka",
    title: "AI-Діагностика справи",
    shortTitle: "AI-Діагностика",
    priceUah: 1200,
    priceLabel: "від 1 200 грн",
    icon: "Sparkles",
    description:
      "Інтерактивна попередня діагностика за 5-10 хвилин з PDF-звітом",
  },
  {
    slug: "antyshtraf-tck-360",
    title: "Антиштраф ТЦК 360°",
    shortTitle: "Антиштраф ТЦК",
    priceUah: 8500,
    priceLabel: "від 8 500 грн",
    icon: "Shield",
    description:
      "Оскарження постанови ТЦК під ключ: досудово та в суді",
  },
  {
    slug: "vlk-pro",
    title: "ВЛК Pro",
    shortTitle: "ВЛК Pro",
    priceUah: 14000,
    priceLabel: "від 14 000 грн",
    icon: "FileCheck",
    description: "Повне оскарження висновку ВЛК: досудово + суд",
  },
  {
    slug: "tck-suprovid",
    title: "Супровід ТЦК",
    shortTitle: "Супровід ТЦК",
    priceUah: 4500,
    priceLabel: "від 4 500 грн",
    icon: "Users",
    description: "1 візит адвоката в ТЦК + 14 днів консультацій",
  },
  {
    slug: "szch-zahyst",
    title: "Захист по СЗЧ",
    shortTitle: "Захист СЗЧ",
    priceUah: 28000,
    priceLabel: "від 28 000 грн",
    icon: "Gavel",
    description: "Кримінальний захист за ст. 407 ККУ",
  },
  {
    slug: "sos-24-7",
    title: "SOS 24/7",
    shortTitle: "SOS 24/7",
    priceUah: 800,
    priceLabel: "від 800 грн",
    icon: "Phone",
    description: "Цілодобова гаряча лінія + виїзд адвоката",
  },
  {
    slug: "b2b-bronyuvannya",
    title: "B2B Бронювання",
    shortTitle: "B2B",
    priceUah: 65000,
    priceLabel: "від 65 000 грн",
    icon: "Building2",
    description: "Критичність + бронювання співробітників",
  },
];

export interface City {
  slug: string;
  nameUk: string;
  nameInflected: string;
}

export const CITIES: City[] = [
  { slug: "kyiv", nameUk: "Київ", nameInflected: "у Києві" },
  { slug: "lviv", nameUk: "Львів", nameInflected: "у Львові" },
  { slug: "dnipro", nameUk: "Дніпро", nameInflected: "у Дніпрі" },
  { slug: "kharkiv", nameUk: "Харків", nameInflected: "у Харкові" },
  { slug: "odesa", nameUk: "Одеса", nameInflected: "в Одесі" },
];

export const NAV_PRIMARY = [
  { label: "Послуги", href: "/poslugy" as const, dropdown: "services" as const },
  { label: "Ціни", href: "/tsiny" as const },
  { label: "Міста", href: "/mista" as const, dropdown: "cities" as const },
  { label: "B2B", href: "/poslugy/b2b-bronyuvannya" as const },
  { label: "Блог", href: "/blog" as const },
  { label: "Контакти", href: "/kontakty" as const },
];

export const LEGAL_PAGES = [
  { slug: "pryvatnist", title: "Політика конфіденційності" },
  { slug: "oferta", title: "Договір публічної оферти" },
  { slug: "zgoda-pd", title: "Згода на обробку ПД" },
  { slug: "pravyla", title: "Правила платформи" },
  { slug: "cookies", title: "Cookies" },
  { slug: "disclaimer", title: "Дисклеймер" },
];

export const COMPANY_PAGES = [
  { slug: "pro-legar", title: "Про LEGAR" },
  { slug: "yak-mi-pratsuemo", title: "Як ми працюємо" },
  { slug: "tsiny", title: "Ціни" },
  { slug: "blog", title: "Блог" },
  { slug: "faq", title: "FAQ" },
  { slug: "dlya-advokativ", title: "Для адвокатів" },
  { slug: "kontakty", title: "Контакти" },
];
