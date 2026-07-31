-- LEGAR — стан діалогу Telegram-бота (квіз-кваліфікація).
-- Один рядок на чат. Дані відповідей — jsonb.

CREATE TABLE IF NOT EXISTS public.tg_sessions (
  chat_id BIGINT PRIMARY KEY,
  step TEXT NOT NULL DEFAULT 'situation',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  username TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tg_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tg_sessions_no_anon" ON public.tg_sessions;
CREATE POLICY "tg_sessions_no_anon" ON public.tg_sessions
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

COMMENT ON TABLE public.tg_sessions IS 'Стан квіз-діалогу Telegram-бота LEGAR. RLS — лише service_role.';
