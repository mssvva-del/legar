-- LEGAR — leads table
-- Зберігає всі заявки з форм сайту.
-- RLS увімкнено: читає/пише тільки service_role (API routes).

CREATE TABLE IF NOT EXISTS public.leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  service TEXT,
  message TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.leads (phone);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically, but ми додаємо deny-all policy
-- щоб anon/authenticated не могли ні читати, ні писати напряму.
DROP POLICY IF EXISTS "leads_no_anon_access" ON public.leads;
CREATE POLICY "leads_no_anon_access" ON public.leads
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.leads IS 'Заявки з форм legar.com.ua. RLS — лише service_role.';
