-- LEGAR — міграція 002: таблиця заявок від адвокатів-партнерів
-- Застосувати через Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS lawyer_applications (
  id              BIGSERIAL PRIMARY KEY,
  full_name       TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  city            TEXT        NOT NULL,
  naau_certificate TEXT       NOT NULL,
  years_practice  INT         NOT NULL,
  specializations TEXT[]      NOT NULL DEFAULT '{}',
  monthly_capacity INT,
  has_military_practice BOOLEAN,
  comment         TEXT,
  status          TEXT        NOT NULL DEFAULT 'new',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: анонімний доступ заборонений (дані читає тільки service_role)
ALTER TABLE lawyer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_anon_lawyer_applications"
  ON lawyer_applications
  FOR ALL
  TO anon
  USING (false);

-- ═══════════════════════════════════════════════════════════════
-- Migration 003: Auth extensions, Cabinet, Documents, Messages
-- ═══════════════════════════════════════════════════════════════

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT CHECK (role IN ('client','lawyer','admin')) DEFAULT 'client' NOT NULL,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  naau_certificate TEXT,
  bio TEXT,
  specializations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid() AND p2.role = 'admin'
    )
  );

-- cases
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id UUID REFERENCES profiles(id),
  service_slug TEXT NOT NULL,
  service_title TEXT NOT NULL,
  price_uah INT NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('lead','contract','paid','in_progress','closed','refunded')) DEFAULT 'lead' NOT NULL,
  description TEXT,
  city TEXT,
  urgency TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cases_client_select"
  ON cases FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "cases_lawyer_select"
  ON cases FOR SELECT
  USING (auth.uid() = lawyer_id);

CREATE POLICY "cases_admin_all"
  ON cases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_case_participants"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE id = case_id
        AND (client_id = auth.uid() OR lawyer_id = auth.uid())
    )
  );

CREATE POLICY "documents_case_participants_insert"
  ON documents FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by
    AND EXISTS (
      SELECT 1 FROM cases
      WHERE id = case_id
        AND (client_id = auth.uid() OR lawyer_id = auth.uid())
    )
  );

CREATE POLICY "documents_admin_all"
  ON documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_case_participants"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE id = case_id
        AND (client_id = auth.uid() OR lawyer_id = auth.uid())
    )
  );

CREATE POLICY "messages_admin_all"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Supabase Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "storage_documents_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_documents_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_avatars_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "storage_avatars_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Auto-create profile on signup trigger
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

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
