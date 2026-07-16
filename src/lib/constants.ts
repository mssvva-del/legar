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
  // Месенджери (підтримка — тільки через форму або 0800)
  telegram: "https://t.me/legar_ukr",
  telegramHandle: "@legar_ukr",
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
  | "Building2"
  | "Scale";

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
    priceUah: 8000,
    priceLabel: "від 8 000 грн",
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
    priceUah: 5000,
    priceLabel: "від 5 000 грн",
    icon: "Users",
    description: "1 візит адвоката в ТЦК + 14 днів консультацій",
  },
  {
    slug: "szch-zahyst",
    title: "Захист по СЗЧ",
    shortTitle: "Захист СЗЧ",
    priceUah: 30000,
    priceLabel: "від 30 000 грн",
    icon: "Gavel",
    description: "Кримінальний захист за ст. 407 ККУ",
  },
  {
    slug: "sos-24-7",
    title: "SOS 24/7",
    shortTitle: "SOS 24/7",
    priceUah: 1500,
    priceLabel: "від 1 500 грн",
    icon: "Phone",
    description: "Цілодобова гаряча лінія + виїзд адвоката",
  },
  {
    slug: "b2b-bronyuvannya",
    title: "B2B Бронювання",
    shortTitle: "B2B",
    priceUah: 50000,
    priceLabel: "від 50 000 грн/міс",
    icon: "Building2",
    description: "Критичність + бронювання співробітників",
  },
  {
    slug: "viyskovyi-advokat",
    title: "Військовий адвокат",
    shortTitle: "Військовий адвокат",
    priceUah: 6000,
    priceLabel: "від 6 000 грн",
    icon: "Scale",
    description: "Персональний адвокат НААУ: ТЦК, ВЛК, СЗЧ, командування, виплати",
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
  { slug: "vinnytsia", nameUk: "Вінниця", nameInflected: "у Вінниці" },
  { slug: "poltava", nameUk: "Полтава", nameInflected: "у Полтаві" },
  { slug: "chernihiv", nameUk: "Чернігів", nameInflected: "у Чернігові" },
  { slug: "cherkasy", nameUk: "Черкаси", nameInflected: "у Черкасах" },
  { slug: "khmelnytskyi", nameUk: "Хмельницький", nameInflected: "у Хмельницькому" },
  { slug: "ivano-frankivsk", nameUk: "Івано-Франківськ", nameInflected: "в Івано-Франківську" },
  { slug: "ternopil", nameUk: "Тернопіль", nameInflected: "у Тернополі" },
  { slug: "lutsk", nameUk: "Луцьк", nameInflected: "у Луцьку" },
  { slug: "rivne", nameUk: "Рівне", nameInflected: "у Рівному" },
  { slug: "uzhhorod", nameUk: "Ужгород", nameInflected: "в Ужгороді" },
  { slug: "chernivtsi", nameUk: "Чернівці", nameInflected: "у Чернівцях" },
  { slug: "zhytomyr", nameUk: "Житомир", nameInflected: "у Житомирі" },
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
