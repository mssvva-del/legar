/**
 * LEGAR — pSEO шар: послуга × місто.
 * Композиція унікального контенту з даних послуги (services-content)
 * та міста (cities-content). Кожна пара 7×17 дає матеріально різний
 * текст, бо тягне унікальні дані з обох осей.
 */

import { SERVICES } from "./constants";
import {
  SERVICES_CONTENT,
  type ServiceSlug,
  type FaqItem,
  type IncludedItem,
} from "./services-content";
import {
  CITIES_CONTENT,
  ALL_CITY_SLUGS,
  type CitySlug,
  type CityContent,
} from "./cities-content";

function districtList(city: CityContent, n = 3): string {
  return city.lawyerVisit.districts.slice(0, n).join(", ");
}

interface ServiceCityAngle {
  /** heroSub + meta description, унікальний фрейм послуги з підстановкою міста */
  lead: (cityInflected: string) => string;
  /** абзац цінності послуги (специфічний для послуги) */
  valuePara: string;
  /** локальний абзац: вплітає райони + час виїзду конкретного міста */
  localPara: (city: CityContent) => string;
  faqQuestion: (cityInflected: string) => string;
  faqAnswer: (city: CityContent) => string;
}

const ANGLES: Record<ServiceSlug, ServiceCityAngle> = {
  "ai-diagnostyka": {
    lead: (c) =>
      `Правова оцінка вашої ситуації за 5–10 хвилин — онлайн, ${c}. AI-алгоритм і перевірка адвокатом НААУ, PDF-звіт із покроковим планом дій.`,
    valuePara:
      "AI-Діагностика LEGAR — швидкий спосіб зрозуміти свою правову ситуацію без черг і дорогих очних консультацій. Інтерактивний алгоритм ставить уточнюючі питання, а адвокат-партнер НААУ перевіряє результат і формує PDF-звіт із покроковим планом дій.",
    localPara: (city) =>
      `Мешканцям ${city.nameInflected} діагностика доступна повністю дистанційно — результат не залежить від завантаженості місцевих ТЦК чи ВЛК. За потреби очного супроводу адвокат виїде у ваш район (${districtList(city)}) за ${city.lawyerVisit.reactionTck}.`,
    faqQuestion: (c) => `Чи доступна AI-Діагностика ${c}?`,
    faqAnswer: (city) =>
      `Так. Послуга повністю онлайн — пройти діагностику можна з будь-якої точки ${city.nameInflected} та області. Якщо знадобиться очний супровід, адвокат-партнер виїде у ваш район.`,
  },
  "antyshtraf-tck-360": {
    lead: (c) =>
      `Оскарження постанови ТЦК ${c} під ключ: досудово та в адміністративному суді. Перевірка процедури, скарга, представництво адвокатом НААУ.`,
    valuePara:
      "Антиштраф ТЦК 360° — оскарження постанови ТЦК під ключ. Адвокати-партнери LEGAR аналізують законність повідомлення, складання протоколу та винесення постанови, готують скаргу й супроводжують справу досудово та в адміністративному суді.",
    localPara: (city) =>
      `${city.nameUk}: оскарження постанов районних ТЦК (${districtList(city)}). Адвокат перевіряє, чи дотримано процедуру вручення повістки та складання протоколу, і за потреби виїжджає для фіксації порушень за ${city.lawyerVisit.reactionTck}.`,
    faqQuestion: (c) => `Скільки коштує оскаржити штраф ТЦК ${c}?`,
    faqAnswer: (city) =>
      `Послуга «Антиштраф ТЦК 360°» стартує від 8 000 грн і включає повний цикл оскарження ${city.nameInflected} — від аналізу постанови до представництва в адміністративному суді.`,
  },
  "vlk-pro": {
    lead: (c) =>
      `Оскарження висновку ВЛК ${c}: збір медичних документів, апеляційна комісія, суд. Супровід адвокатами-партнерами НААУ.`,
    valuePara:
      "ВЛК Pro — повне оскарження висновку військово-лікарської комісії. LEGAR допомагає зібрати медичні документи через профільних лікарів, подати скаргу до апеляційної ВЛК і, за потреби, оскаржити рішення в суді.",
    localPara: (city) =>
      `Обласна ВЛК ${city.nameInflected} працює з високим навантаженням, тож формальні висновки — не рідкість. Адвокат LEGAR супроводжує оскарження по районах (${districtList(city)}) та на апеляційному рівні.`,
    faqQuestion: (c) => `Як оскаржити висновок ВЛК ${c}?`,
    faqAnswer: (city) =>
      `Адвокат аналізує висновок, допомагає зібрати медичні документи від профільних лікарів і подає скаргу до апеляційної ВЛК. Більшість етапів ${city.nameInflected} проходить дистанційно.`,
  },
  "tck-suprovid": {
    lead: (c) =>
      `Адвокат поруч під час візиту в ТЦК ${c}: контроль законності, фіксація порушень, 14 днів консультацій після візиту.`,
    valuePara:
      "Супровід ТЦК — присутність адвоката під час вашого візиту до територіального центру комплектування. Адвокат контролює законність дій, не дає чинити тиск і фіксує порушення. Послуга включає 14 днів консультацій після візиту.",
    localPara: (city) =>
      `Супровід доступний у районних ТЦК ${city.nameInflected} (${districtList(city)}). Адвокат-партнер прибуває на місце за ${city.lawyerVisit.reactionTck} і супроводжує вас протягом усієї процедури.`,
    faqQuestion: (c) => `Чи може адвокат супроводжувати мене в ТЦК ${c}?`,
    faqAnswer: (city) =>
      `Так. Адвокат-партнер LEGAR ${city.nameInflected} супроводжує вас під час візиту в ТЦК, контролює дотримання процедури та фіксує можливі порушення.`,
  },
  "szch-zahyst": {
    lead: (c) =>
      `Кримінальний захист за ст. 407 ККУ (СЗЧ) ${c}. Лінія захисту, докази поважних причин, представництво в суді.`,
    valuePara:
      "Захист по СЗЧ — кримінальний захист за статтею 407 ККУ (самовільне залишення частини). Адвокати-партнери LEGAR вибудовують лінію захисту з урахуванням поважних причин і пом'якшуючих обставин на всіх стадіях провадження.",
    localPara: (city) =>
      `Справи за ст. 407 ККУ ${city.nameInflected} розглядаються місцевими судами. Адвокат збирає докази поважності причин і представляє інтереси клієнта по районах (${districtList(city)}).`,
    faqQuestion: (c) => `Хто захищає у справах СЗЧ (ст. 407 ККУ) ${c}?`,
    faqAnswer: (city) =>
      `Адвокати-партнери НААУ ${city.nameInflected} ведуть кримінальний захист за ст. 407 ККУ: аналізують обставини, збирають докази поважних причин і будують лінію захисту в суді.`,
  },
  "sos-24-7": {
    lead: (c) =>
      `Цілодобова допомога при затриманні ${c}. Один дзвінок — і адвокат виїжджає на місце. Лінія SOS працює 24/7.`,
    valuePara:
      "SOS 24/7 — цілодобова гаряча лінія з можливістю термінового виїзду адвоката. Якщо вас затримали для перевірки документів або намагаються доставити в ТЦК без підстав — один дзвінок підключає адвоката-партнера.",
    localPara: (city) =>
      `${city.nameUk}: екстрений виїзд адвоката за ${city.lawyerVisit.reactionDetention} у будь-який район (${districtList(city)}). Лінія SOS працює цілодобово, включно з вихідними та нічним часом.`,
    faqQuestion: (c) => `Що робити при затриманні ТЦК ${c}?`,
    faqAnswer: (city) =>
      `Зберігайте спокій, не підписуйте документи без юриста й телефонуйте на лінію SOS 24/7. Адвокат-партнер LEGAR виїде до вас ${city.nameInflected} за ${city.lawyerVisit.reactionDetention}.`,
  },
  "b2b-bronyuvannya": {
    lead: (c) =>
      `Бронювання працівників і статус критично важливого підприємства ${c}. Оцінка критичності, документи, супровід до Мінекономіки.`,
    valuePara:
      "B2B Бронювання — комплексна послуга для бізнесу: отримання статусу критично важливого підприємства та бронювання співробітників. LEGAR оцінює критичність, готує техніко-економічне обґрунтування й супроводжує заявку до Мінекономіки.",
    localPara: (city) =>
      `Підприємствам ${city.nameInflected} LEGAR допомагає правильно обґрунтувати критичність функцій персоналу. Працюємо з компаніями міста та області, включно з районами ${districtList(city)}.`,
    faqQuestion: (c) => `Як забронювати працівників підприємства ${c}?`,
    faqAnswer: (city) =>
      `LEGAR B2B оцінює критичність, готує техніко-економічне обґрунтування та супроводжує заявку на бронювання до Мінекономіки. Послуга доступна підприємствам ${city.nameInflected} та області.`,
  },
};

export interface ServiceCityContent {
  serviceSlug: ServiceSlug;
  citySlug: CitySlug;
  serviceTitle: string;
  serviceShortTitle: string;
  serviceIcon: string;
  priceLabel: string;
  priceUah: number;
  cityNameUk: string;
  cityNameInflected: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  heroSub: string;
  intro: string[];
  included: IncludedItem[];
  reactionTck: string;
  districts: string[];
  faq: FaqItem[];
}

export function isValidServiceCity(
  serviceSlug: string,
  citySlug: string,
): boolean {
  return (
    serviceSlug in SERVICES_CONTENT &&
    citySlug in CITIES_CONTENT
  );
}

export function getServiceCityContent(
  serviceSlug: string,
  citySlug: string,
): ServiceCityContent | null {
  if (!isValidServiceCity(serviceSlug, citySlug)) return null;

  const s = serviceSlug as ServiceSlug;
  const c = citySlug as CitySlug;
  const service = SERVICES.find((x) => x.slug === s);
  const serviceContent = SERVICES_CONTENT[s];
  const city = CITIES_CONTENT[c];
  if (!service) return null;

  const angle = ANGLES[s];
  const inflected = city.nameInflected;

  const metaTitle = `${service.shortTitle} ${inflected} — LEGAR | ${service.priceLabel}`;
  const metaDescription = angle.lead(inflected).slice(0, 160);

  const keywords = [
    `${service.shortTitle} ${city.nameUk}`,
    ...serviceContent.meta.keywords.slice(0, 2).map((k) => `${k} ${city.nameUk}`),
    `військовий адвокат ${city.nameUk}`,
  ];

  // Об'єднана FAQ: послуга×місто + 2 з міста + 1 з послуги (з дедуплікацією)
  const faq: FaqItem[] = [
    { question: angle.faqQuestion(inflected), answer: angle.faqAnswer(city) },
    ...city.faq.slice(0, 2).map((f) => ({ question: f.question, answer: f.answer })),
    ...serviceContent.faq.slice(0, 1).map((f) => ({ question: f.question, answer: f.answer })),
  ];
  const seen = new Set<string>();
  const dedupedFaq = faq.filter((f) => {
    if (seen.has(f.question)) return false;
    seen.add(f.question);
    return true;
  });

  return {
    serviceSlug: s,
    citySlug: c,
    serviceTitle: service.title,
    serviceShortTitle: service.shortTitle,
    serviceIcon: service.icon,
    priceLabel: service.priceLabel,
    priceUah: service.priceUah,
    cityNameUk: city.nameUk,
    cityNameInflected: inflected,
    metaTitle,
    metaDescription,
    keywords,
    h1: `${service.title} ${inflected}`,
    heroSub: angle.lead(inflected),
    intro: [angle.valuePara, angle.localPara(city)],
    included: serviceContent.whatsIncluded.slice(0, 6),
    reactionTck: city.lawyerVisit.reactionTck,
    districts: city.lawyerVisit.districts,
    faq: dedupedFaq,
  };
}

/** Усі валідні пари service×city для generateStaticParams / sitemap. */
export function allServiceCityPairs(): Array<{ service: ServiceSlug; city: CitySlug }> {
  const services = Object.keys(SERVICES_CONTENT) as ServiceSlug[];
  return services.flatMap((service) =>
    ALL_CITY_SLUGS.map((city) => ({ service, city })),
  );
}

/** Міста для конкретної послуги (для generateStaticParams у [city] під папкою послуги). */
export function cityParamsForService(): Array<{ city: CitySlug }> {
  return ALL_CITY_SLUGS.map((city) => ({ city }));
}
