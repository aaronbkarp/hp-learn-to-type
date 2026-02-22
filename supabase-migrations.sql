-- ============================================================
-- Hogwarts Spellcaster — Supabase SQL Migrations
-- Run these in order in the Supabase SQL Editor:
--   supabase.com/dashboard → Your Project → SQL Editor
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. profiles
--    One row per user, auto-created on first Google sign-in
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username     text        NOT NULL UNIQUE,
  display_name text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- 2. user_progress
--    Cumulative stats per user (one row per user)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_progress (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  current_level             integer     DEFAULT 1  CHECK (current_level  >= 1),
  max_level_reached         integer     DEFAULT 1  CHECK (max_level_reached >= 1),
  total_spells_typed        integer     DEFAULT 0  CHECK (total_spells_typed  >= 0),
  total_spells_missed       integer     DEFAULT 0  CHECK (total_spells_missed >= 0),
  total_sessions            integer     DEFAULT 0  CHECK (total_sessions >= 0),
  total_time_played_seconds integer     DEFAULT 0  CHECK (total_time_played_seconds >= 0),
  last_played_at            timestamptz,
  updated_at                timestamptz DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 3. level_scores
--    Best scores per user per level
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.level_scores (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  level           integer     NOT NULL CHECK (level >= 1 AND level <= 10),
  best_score      integer     DEFAULT 0,
  best_accuracy   numeric(5,2) DEFAULT 0.00 CHECK (best_accuracy >= 0 AND best_accuracy <= 100),
  games_played    integer     DEFAULT 0,
  times_completed integer     DEFAULT 0,
  last_played_at  timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (user_id, level)
);

ALTER TABLE public.level_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores"
  ON public.level_scores FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON public.level_scores FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores"
  ON public.level_scores FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 4. Triggers — auto-create profile and progress on signup
-- ────────────────────────────────────────────────────────────

-- Auto-create profile when a new user signs up via Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1),
      NEW.id::text
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Auto-create user_progress row when a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();


-- ────────────────────────────────────────────────────────────
-- 5. updated_at trigger (reusable)
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at      ON public.profiles;
DROP TRIGGER IF EXISTS set_user_progress_updated_at ON public.user_progress;
DROP TRIGGER IF EXISTS set_level_scores_updated_at  ON public.level_scores;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_level_scores_updated_at
  BEFORE UPDATE ON public.level_scores
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 6. upsert_level_score RPC
--    Called from the frontend after each game session.
--    Uses GREATEST() to never overwrite a better score.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.upsert_level_score(
  p_user_id   uuid,
  p_level     integer,
  p_score     integer,
  p_accuracy  numeric,
  p_completed boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.level_scores
    (user_id, level, best_score, best_accuracy, games_played, times_completed, last_played_at)
  VALUES
    (p_user_id, p_level, p_score, p_accuracy, 1,
     CASE WHEN p_completed THEN 1 ELSE 0 END,
     now())
  ON CONFLICT (user_id, level) DO UPDATE SET
    best_score      = GREATEST(level_scores.best_score, p_score),
    best_accuracy   = GREATEST(level_scores.best_accuracy, p_accuracy),
    games_played    = level_scores.games_played + 1,
    times_completed = level_scores.times_completed + CASE WHEN p_completed THEN 1 ELSE 0 END,
    last_played_at  = now(),
    updated_at      = now();
END;
$$;


-- ────────────────────────────────────────────────────────────
-- Verification queries (run after migrations to confirm setup)
-- ────────────────────────────────────────────────────────────

-- Check tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check triggers:
-- SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';
