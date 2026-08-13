-- HQ — рівень холдингу.
-- Асистент веде не одну компанію, а групу: компанія → напрямок.
-- LEGAR стає однією з компаній, а не назвою всієї системи.

ALTER TABLE public.hq_projects
  ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES public.hq_projects(id) ON DELETE SET NULL;

-- Хто відповідає за компанію: за замовчуванням задачі без виконавця летять сюди.
ALTER TABLE public.hq_projects
  ADD COLUMN IF NOT EXISTS owner_id BIGINT REFERENCES public.hq_people(id) ON DELETE SET NULL;

-- Порядок у списках: компанії сортуються як задав власник, а не за id.
ALTER TABLE public.hq_projects
  ADD COLUMN IF NOT EXISTS sort SMALLINT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS hq_projects_parent_idx ON public.hq_projects (parent_id);

COMMENT ON COLUMN public.hq_projects.parent_id IS 'NULL — це компанія холдингу; заповнено — напрямок усередині компанії.';

-- Назва системи в інтерфейсі бота. Змінюється без деплою.
INSERT INTO public.hq_settings (key, value) VALUES
  ('brand', '"Штаб"'::jsonb)
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE public.hq_projects IS 'Компанії групи та напрямки всередині них.';
