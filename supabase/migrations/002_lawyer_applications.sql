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
