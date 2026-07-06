import Link from "next/link";
import { MailWarning, HeartPulse, Scale, Check, ArrowRight } from "lucide-react";

const PROBLEMS = [
  {
    icon: MailWarning,
    title: "Викликають у ТЦК",
    description:
      "Отримали повістку або вас зупинили на вулиці? Не реагуйте емоційно. Адвокат-партнер LEGAR супроводить вас на візит у ТЦК, перевірить законність дій представників та допоможе обстояти ваші права.",
    bullets: [
      "Незаконна повістка",
      "Затримання представниками ТЦК",
      "Порушення процедури",
    ],
    price: "від 5 000 грн",
    href: "/poslugy/tck-suprovid",
  },
  {
    icon: HeartPulse,
    title: "Проблеми з ВЛК",
    description:
      "ВЛК визнала вас придатним, хоч у вас є серйозні захворювання? Або вам відмовили в комісії? Адвокат-партнер допоможе оскаржити висновок ВЛК — спочатку досудово, потім у суді, якщо потрібно.",
    bullets: [
      "Незгода з категорією придатності",
      "Відмова в перегляді справи",
      "Порушення процедури обстеження",
    ],
    price: "від 14 000 грн",
    href: "/poslugy/vlk-pro",
  },
  {
    icon: Scale,
    title: "Захист по СЗЧ",
    description:
      "Проти вас відкрили кримінальне провадження за самовільне залишення частини? У 2025 році було відкрито понад 161 000 справ за ст. 407 ККУ. Грамотний захист на досудовій стадії може кардинально змінити результат.",
    bullets: [
      "Захист на досудовому слідстві",
      "Представництво у суді",
      "Стратегія мінімізації відповідальності",
    ],
    price: "від 30 000 грн",
    href: "/poslugy/szch-zahyst",
  },
] as const;

export function ProblemSection() {
  return (
    <section
      aria-labelledby="problems-title"
      className="bg-white py-20 md:py-24"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-600)]">
            Ваші ситуації
          </p>
          <h2
            id="problems-title"
            className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[40px]"
          >
            З якою проблемою ви зіткнулися?
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
            LEGAR покриває весь спектр військово-правових питань. Оберіть свою
            ситуацію, і ми покажемо, як можемо допомогти за 5-10 хвилин.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROBLEMS.map(({ icon: Icon, ...p }) => (
            <article
              key={p.title}
              className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white"
              >
                <Icon className="h-7 w-7" />
              </span>

              <h3 className="mt-6 font-[family-name:var(--font-manrope)] text-[24px] font-extrabold leading-tight text-[var(--color-ink)]">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--color-ink)]/70">
                {p.description}
              </p>

              <ul className="mt-5 space-y-2">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-[14px] text-[var(--color-ink)]/80"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-success)]"
                      aria-hidden="true"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-5">
                <span className="font-[family-name:var(--font-manrope)] text-[18px] font-extrabold text-[var(--color-ink)]">
                  <span className="text-[var(--color-accent-600)]">●</span>{" "}
                  {p.price}
                </span>
                <Link
                  href={p.href as `/poslugy/${string}`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-600)]"
                >
                  Перейти до послуги
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
