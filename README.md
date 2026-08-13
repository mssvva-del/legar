# LEGAR — Юридичний щит України

> Платформа правової допомоги для захисту від ТЦК, ВЛК та військових проблем.  
> Сайт: **legar.com.ua**

---

## Стек

| Шар | Технологія |
|-----|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Стилі | Tailwind CSS v4 (`@theme` CSS variables) |
| Auth | Supabase Auth (email+password, magic link) |
| БД | Supabase PostgreSQL + RLS |
| Email | Resend (транзакційні листи) |
| Analytics | GA4 + Meta Pixel + TikTok Pixel (Consent Mode v2) |
| Deploy | Vercel (рекомендовано) |

---

## Структура

```
src/
├── app/
│   ├── (public)/          # Публічні сторінки
│   │   ├── page.tsx       # Головна
│   │   ├── poslugy/       # 7 послуг
│   │   ├── mista/         # 5 міст
│   │   ├── legal/[slug]/  # 6 юридичних сторінок
│   │   ├── cabinet/       # Кабінет клієнта (5 сторінок)
│   │   ├── faq/           # FAQ з пошуком
│   │   ├── tsiny/         # Ціни
│   │   ├── pro-legar/     # Про нас
│   │   └── ...
│   ├── (auth)/            # Авторизація
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/             # Адмін-панель
│   │   ├── page.tsx       # Огляд
│   │   ├── lidy/          # Ліди
│   │   └── applications/  # Заявки адвокатів
│   └── api/               # API routes
│       ├── leads/
│       ├── cases/
│       ├── documents/
│       ├── messages/
│       └── lawyer-applications/
├── components/
│   ├── layout/            # Header, Footer, MobileMenu
│   ├── home/              # 10 секцій головної
│   ├── services/          # Компоненти послуг
│   ├── shared/            # CookieBanner, LeadForm, Logo
│   └── analytics/         # GA4, MetaPixel
└── lib/
    ├── supabase/          # client, server, types
    ├── emails/            # Resend templates
    ├── constants.ts       # CONTACTS, CITIES, COMPANY
    └── validations.ts     # Zod schemas
```

---

## Запуск

```bash
# Встановити залежності
npm install

# Скопіювати env
cp .env.local.example .env.local
# Заповнити змінні (Supabase, Resend, GA4...)

# Запустити Supabase міграції
# supabase db push (або через Supabase Dashboard)

# Розробка
npm run dev

# Білд
npm run build
```

---

## ENV змінні

Див. `.env.local.example` — всі необхідні ключі з коментарями:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (тільки server-side)
- `RESEND_API_KEY` + `RESEND_FROM`
- `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` / `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`

---

## Сторінки (45 всього)

| Тип | Кількість |
|-----|-----------|
| Публічні | 25 |
| Послуги | 7 |
| Міста | 5 |
| Юридичні | 6 |
| Auth | 4 |
| Cabinet | 5 |
| Admin | 3 |
| API routes | 8 |

---

## HQ («Штаб») — асистент засновників групи компаній

Telegram-бот для внутрішніх задач власників: постановка, драбина нагадувань,
ескалація при простроченні, приймання роботи постановником, зведення двічі
на день. Веде всю групу компаній — LEGAR тут одна з них, задачі
розкладаються по компаніях і напрямках.

Код — `src/app/api/hq/*` і `src/lib/hq/*`, міграції —
`supabase/migrations/004_hq_assistant.sql` і `005_hq_holding.sql`.

Налаштування за 20 хвилин: **[docs/HQ-SETUP.md](docs/HQ-SETUP.md)**

---

## Деплой

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mssvva-del/legar)

1. Підключити репозиторій до Vercel
2. Додати ENV змінні в Vercel Dashboard
3. Запустити міграції в Supabase
4. Деплой — автоматичний при push в `main`

---

*LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.*
