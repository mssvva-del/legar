-- ═══════════════════════════════════════════════════════════════════
-- LEGAR — ALL MIGRATIONS COMBINED (001 + 002 + 003)
-- Запустити одним разом у Supabase SQL Editor
-- Проект: aynoxwxmhljarpkqctne.supabase.co
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- 001: leads
-- ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id          BIGSERIAL    PRIMARY KEY,
  name        TEXT         NOT NULL,
  phone       TEXT         NOT NULL,
  email       TEXT,
  city        TEXT,
  service     TEXT,
  message     TEXT,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  status      TEXT         NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx     ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_idx      ON public.leads (phone);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_no_anon_access" ON public.leads;
CREATE POLICY "leads_no_anon_access" ON public.leads
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.leads IS 'Заявки з форм legar.com.ua. RLS — лише service_role.';

-- ───────────────────────────────────────────────────────────────────
-- 002: lawyer_applications
-- ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.lawyer_applications (
  id                   BIGSERIAL    PRIMARY KEY,
  full_name            TEXT         NOT NULL,
  email                TEXT         NOT NULL,
  phone                TEXT         NOT NULL,
  city                 TEXT         NOT NULL,
  naau_certificate     TEXT         NOT NULL,
  years_practice       INT          NOT NULL,
  specializations      TEXT[]       NOT NULL DEFAULT '{}',
  monthly_capacity     INT,
  has_military_practice BOOLEAN,
  comment              TEXT,
  status               TEXT         NOT NULL DEFAULT 'new',
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lawyer_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_anon_lawyer_applications" ON public.lawyer_applications;
CREATE POLICY "deny_anon_lawyer_applications"
  ON public.lawyer_applications FOR ALL TO anon
  USING (false);

-- ───────────────────────────────────────────────────────────────────
-- 003: profiles, cases, documents, messages, storage, triggers
-- ───────────────────────────────────────────────────────────────────

-- profiles (extends auth.users 1-to-1)
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID         PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role             TEXT         CHECK (role IN ('client','lawyer','admin')) DEFAULT 'client' NOT NULL,
  full_name        TEXT,
  phone            TEXT,
  city             TEXT,
  avatar_url       TEXT,
  naau_certificate TEXT,
  bio              TEXT,
  specializations  TEXT[]       DEFAULT '{}',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"   ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin')
  );

-- cases
CREATE TABLE IF NOT EXISTS public.cases (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID         REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id     UUID         REFERENCES public.profiles(id),
  service_slug  TEXT,                          -- nullable (optional at creation)
  service_title TEXT         NOT NULL,
  price_uah     INT          NOT NULL DEFAULT 0,
  status        TEXT         CHECK (status IN ('lead','contract','paid','in_progress','closed','refunded')) DEFAULT 'lead' NOT NULL,
  description   TEXT,
  city          TEXT,
  urgency       TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cases_client_select" ON public.cases;
DROP POLICY IF EXISTS "cases_lawyer_select" ON public.cases;
DROP POLICY IF EXISTS "cases_admin_all"     ON public.cases;

CREATE POLICY "cases_client_select" ON public.cases FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "cases_lawyer_select" ON public.cases FOR SELECT
  USING (auth.uid() = lawyer_id);

CREATE POLICY "cases_admin_all" ON public.cases FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- documents
CREATE TABLE IF NOT EXISTS public.documents (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      UUID         REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  uploaded_by  UUID         REFERENCES public.profiles(id) NOT NULL,
  storage_path TEXT         NOT NULL,
  file_name    TEXT         NOT NULL,
  file_size    INT,
  file_type    TEXT,                            -- MIME type (was mime_type — renamed to match API)
  is_signed    BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documents_case_participants"        ON public.documents;
DROP POLICY IF EXISTS "documents_case_participants_insert" ON public.documents;
DROP POLICY IF EXISTS "documents_admin_all"               ON public.documents;

CREATE POLICY "documents_case_participants" ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE id = case_id AND (client_id = auth.uid() OR lawyer_id = auth.uid())
    )
  );

CREATE POLICY "documents_case_participants_insert" ON public.documents FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE id = case_id AND (client_id = auth.uid() OR lawyer_id = auth.uid())
    )
  );

CREATE POLICY "documents_admin_all" ON public.documents FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- messages
CREATE TABLE IF NOT EXISTS public.messages (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id    UUID         REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  sender_id  UUID         REFERENCES public.profiles(id) NOT NULL,
  body       TEXT         NOT NULL,
  read_at    TIMESTAMPTZ,                       -- NULL = unread (was is_read BOOLEAN — changed to match API)
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_case_participants" ON public.messages;
DROP POLICY IF EXISTS "messages_admin_all"         ON public.messages;

CREATE POLICY "messages_case_participants" ON public.messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE id = case_id AND (client_id = auth.uid() OR lawyer_id = auth.uid())
    )
  );

CREATE POLICY "messages_admin_all" ON public.messages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Supabase Storage buckets ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('avatars',   'avatars',   true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "storage_documents_upload"  ON storage.objects;
DROP POLICY IF EXISTS "storage_documents_select"  ON storage.objects;
DROP POLICY IF EXISTS "storage_avatars_public"    ON storage.objects;
DROP POLICY IF EXISTS "storage_avatars_upload"    ON storage.objects;

CREATE POLICY "storage_documents_upload" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_documents_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_avatars_public" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "storage_avatars_upload" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── Triggers ─────────────────────────────────────────────────────

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    'client',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS cases_updated_at ON public.cases;
CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- END OF MIGRATIONS
-- Tables: leads, lawyer_applications, profiles, cases, documents, messages
-- Storage: documents (private), avatars (public)
-- Triggers: handle_new_user, set_updated_at
-- ═══════════════════════════════════════════════════════════════════
