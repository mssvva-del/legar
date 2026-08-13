-- LEGAR HQ — персональний асистент засновників (Telegram-бот).
-- Задачі, дедлайни, драбина нагадувань, ескалація, приймання роботи.
-- RLS: доступ лише через service_role (API routes /api/hq/*).

-- ── Люди ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hq_people (
  id BIGSERIAL PRIMARY KEY,
  tg_id BIGINT NOT NULL UNIQUE,          -- Telegram user id
  name TEXT NOT NULL,                    -- як звертатися: «Вікторія»
  aliases TEXT[] NOT NULL DEFAULT '{}',  -- «вика», «вите», «серёже» — для розбору тексту
  username TEXT,                         -- @username без «@»
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  pending JSONB,                         -- очікувана дія: {kind:'result', task_id:12}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hq_people_tg_idx ON public.hq_people (tg_id);

-- ── Проєкти / напрямки бізнесу ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hq_projects (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,              -- 'legar', 'hotels' — для #тегів
  title TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Задачі та події ───────────────────────────────────────────────────────
-- kind:   task  — треба зробити до дедлайну
--         event — дзвінок/зустріч у конкретний час (інша драбина нагадувань)
-- status: draft — чернетка, чекає підтвердження постановника
--         open  — поставлена
--         doing — взята в роботу
--         submitted — виконавець здав, чекає приймання
--         done | cancelled
CREATE TABLE IF NOT EXISTS public.hq_tasks (
  id BIGSERIAL PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'task',
  title TEXT NOT NULL,
  details TEXT,
  project_id BIGINT REFERENCES public.hq_projects(id) ON DELETE SET NULL,
  creator_id BIGINT NOT NULL REFERENCES public.hq_people(id) ON DELETE CASCADE,
  assignee_id BIGINT NOT NULL REFERENCES public.hq_people(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  due_at TIMESTAMPTZ,
  result TEXT,                           -- що здав виконавець
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{type,file_id,caption}]
  source_chat_id BIGINT,                 -- звідки прийшла задача
  snoozes SMALLINT NOT NULL DEFAULT 0,   -- скільки разів переносили — метрика перевантаження
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  done_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS hq_tasks_open_idx ON public.hq_tasks (status, due_at);
CREATE INDEX IF NOT EXISTS hq_tasks_assignee_idx ON public.hq_tasks (assignee_id, status);
CREATE INDEX IF NOT EXISTS hq_tasks_creator_idx ON public.hq_tasks (creator_id, status);

-- ── Нагадування ───────────────────────────────────────────────────────────
-- Драбина прораховується наперед при постановці задачі.
-- kind: lead — до дедлайну, due — у момент дедлайну, escalate — після прострочення
-- target: assignee | creator | both
CREATE TABLE IF NOT EXISTS public.hq_reminders (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL REFERENCES public.hq_tasks(id) ON DELETE CASCADE,
  fire_at TIMESTAMPTZ NOT NULL,
  kind TEXT NOT NULL,
  label TEXT,                            -- «за 2 години», «дедлайн»
  target TEXT NOT NULL DEFAULT 'assignee',
  sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS hq_reminders_due_idx ON public.hq_reminders (fire_at) WHERE sent_at IS NULL;
CREATE INDEX IF NOT EXISTS hq_reminders_task_idx ON public.hq_reminders (task_id);

-- ── Налаштування (час дайджестів, тихі години, ліміт WIP) ─────────────────
CREATE TABLE IF NOT EXISTS public.hq_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.hq_settings (key, value) VALUES
  ('tz',            '"Europe/Kyiv"'::jsonb),
  ('digest_morning','"08:30"'::jsonb),
  ('digest_evening','"20:30"'::jsonb),
  ('quiet_from',    '"22:00"'::jsonb),
  ('quiet_to',      '"08:00"'::jsonb),
  ('escalate_every_min', '30'::jsonb),
  ('escalate_max',       '8'::jsonb),
  ('wip_limit',          '3'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ── RLS: тільки service_role ──────────────────────────────────────────────
ALTER TABLE public.hq_people    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hq_settings  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hq_people_no_anon"    ON public.hq_people;
DROP POLICY IF EXISTS "hq_projects_no_anon"  ON public.hq_projects;
DROP POLICY IF EXISTS "hq_tasks_no_anon"     ON public.hq_tasks;
DROP POLICY IF EXISTS "hq_reminders_no_anon" ON public.hq_reminders;
DROP POLICY IF EXISTS "hq_settings_no_anon"  ON public.hq_settings;

CREATE POLICY "hq_people_no_anon"    ON public.hq_people    FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "hq_projects_no_anon"  ON public.hq_projects  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "hq_tasks_no_anon"     ON public.hq_tasks     FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "hq_reminders_no_anon" ON public.hq_reminders FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "hq_settings_no_anon"  ON public.hq_settings  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

COMMENT ON TABLE public.hq_tasks IS 'LEGAR HQ — задачі засновників. RLS: лише service_role.';
