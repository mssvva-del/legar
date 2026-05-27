import { SERVICES } from "@/lib/constants";
import { ServiceCard } from "@/components/shared/ServiceCard";

export function ServicesGrid() {
  return (
    <section
      aria-labelledby="services-title"
      className="bg-[var(--color-bg-200)] py-20 md:py-24"
    >
      <div className="container-legar">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-600)]">
            Всі послуги
          </p>
          <h2
            id="services-title"
            className="mt-3 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[40px]"
          >
            Закриваємо весь військово-правовий спектр
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
            Прозорі ціни, фіксовані пакети, договір онлайн. Жодних прихованих
            платежів.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
