-- ============================================
-- SATI ACADEMY - ESQUEMA WEB2 CORREGIDO
-- Autenticación: Supabase Auth (email) + Thirdweb (wallets)
-- Base de datos: Supabase
-- ============================================

-- Tabla de usuarios (vinculada a auth.users)
CREATE TABLE IF NOT EXISTS sati_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Perfil
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  
  -- Thirdweb (opcional)
  thirdweb_account_id TEXT UNIQUE,
  
  -- Progreso
  current_stage INT DEFAULT 1,
  current_lesson INT DEFAULT 1,
  total_points INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_streak_date DATE,
  
  -- Badges
  badges_earned TEXT[] DEFAULT '{}',
  
  -- Configuración
  preferences JSONB DEFAULT '{"notifications": true, "darkMode": true}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sati_users_email ON sati_users(email);
CREATE INDEX IF NOT EXISTS idx_sati_users_thirdweb ON sati_users(thirdweb_account_id);

-- Trigger para crear usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sati_users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  
  -- Crear registro de tokens
  INSERT INTO public.sati_tokens (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE sati_users ENABLE ROW LEVEL SECURITY;

-- Política: Usuario solo ve sus datos
CREATE POLICY "Users can view own data" ON sati_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON sati_users
  FOR UPDATE USING (auth.uid() = id);

-- Tabla de tokens $SATI
CREATE TABLE IF NOT EXISTS sati_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES sati_users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(18, 8) DEFAULT 0,
  total_earned DECIMAL(18, 8) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de progreso de lecciones
CREATE TABLE IF NOT EXISTS sati_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES sati_users(id) ON DELETE CASCADE,
  stage INT NOT NULL,
  lesson_index INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, stage, lesson_index)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON sati_lesson_progress(user_id);

-- Tabla de actividad diaria (racha)
CREATE TABLE IF NOT EXISTS sati_daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES sati_users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  lessons_completed INT DEFAULT 0,
  points_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON sati_daily_activity(user_id, activity_date DESC);

-- Verificar
SELECT '✅ Tablas de Sati Academy creadas' as status;
