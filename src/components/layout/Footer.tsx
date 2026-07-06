import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
  TelegramIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { Logo } from "@/components/shared/Logo";
import {
  CONTACTS,
  SERVICES,
  COMPANY_PAGES,
  LEGAL_PAGES,
  COMPANY,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[var(--color-ink)] text-white"
    >
      <div className="container-legar py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand column — 4 cols on lg */}
          <div className="lg:col-span-4">
            <Logo variant="dark" showTagline size="lg" />
            <p className="mt-6 max-w-[320px] text-[14px] leading-relaxed text-white/65">
              {COMPANY.description}. Інформаційно-консультаційна платформа.
              Юридичні послуги надають адвокати-партнери НААУ.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <PhoneLink
                href={CONTACTS.phoneTel}
                source="footer"
                className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-white transition-colors hover:text-[var(--color-accent)]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span className="tabular-nums">{CONTACTS.phone}</span>
                <span className="text-[11px] text-white/45 font-normal">безкоштовно</span>
              </PhoneLink>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="inline-flex items-center gap-2.5 text-[14px] text-white/70 transition-colors hover:text-[var(--color-accent)]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACTS.email}
              </a>
            </div>

            {/* Social + Telegram channel */}
            <div className="mt-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Соцмережі</p>
              <div className="flex items-center gap-2">
                {[
                  { href: CONTACTS.telegramChannel, label: "Telegram", Icon: TelegramIcon },
                  { href: CONTACTS.instagram, label: "Instagram", Icon: InstagramIcon },
                  { href: CONTACTS.youtube, label: "YouTube", Icon: YoutubeIcon },
                  { href: CONTACTS.facebook, label: "Facebook", Icon: FacebookIcon },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Services column */}
          <div className="lg:col-span-3 lg:col-start-6">
            <FooterHeading>Послуги</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/poslugy/${s.slug}` as `/poslugy/${string}`}
                    className="text-[14px] text-white/70 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="lg:col-span-2 lg:col-start-9">
            <FooterHeading>Компанія</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              {COMPANY_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}` as `/${string}`}
                    className="text-[14px] text-white/70 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div className="lg:col-span-2 lg:col-start-11">
            <FooterHeading>Юр-документи</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/legal/${p.slug}` as `/legal/${string}`}
                    className="text-[14px] text-white/70 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-legar flex flex-col items-start justify-between gap-3 py-6 text-[12px] text-white/60 md:flex-row md:items-center">
          <p>
            © 2026 LEGAR. {COMPANY.legalName}. Усі права захищені.
          </p>
          <p className="max-w-[520px] md:text-right">
            LEGAR — інформаційно-консультаційна платформа. Не є адвокатським
            об&apos;єднанням.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
      {children}
    </h2>
  );
}
