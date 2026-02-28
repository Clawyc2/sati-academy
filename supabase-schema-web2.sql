-- ============================================
-- SATI ACADEMY - ESQUEMA WEB2
-- Autenticación: Thirdweb (Google/Discord/Email)
-- Base de datos: Supabase
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS sati_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identificación (Web2)
  email TEXT UNIQUE,
  thirdweb_account_id TEXT UNIQUE, -- ID interno de Thirdweb
  provider TEXT, -- 'google', 'discord', 'email'
  provider_user_id TEXT, -- ID del usuario en el provider
  
  -- Perfil
  name TEXT,
  avatar_url TEXT,
  
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

-- RLS
ALTER TABLE sati_users ENABLE ROW LEVEL SECURITY;

-- Política: Solo el usuario puede ver sus datos
CREATE POLICY "Users can view own data" ON sati_users
  FOR ALL 
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR thirdweb_account_id = current_setting('request.headers', true)::json->>'x-thirdweb-account'
  );

-- Función para crear/actualizar usuario
CREATE OR REPLACE FUNCTION upsert_sati_user(
  p_email TEXT,
  p_thirdweb_account_id TEXT,
  p_provider TEXT DEFAULT NULL,
  p_provider_user_id TEXT DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Intentar encontrar por email primero
  IF p_email IS NOT NULL THEN
    SELECT id INTO v_user_id FROM sati_users WHERE email = p_email;
  END IF;
  
  -- Si no encontró, buscar por thirdweb_account_id
  IF v_user_id IS NULL AND p_thirdweb_account_id IS NOT NULL THEN
    SELECT id INTO v_user_id FROM sati_users WHERE thirdweb_account_id = p_thirdweb_account_id;
  END IF;
  
  -- Si existe, actualizar
  IF v_user_id IS NOT NULL THEN
    UPDATE sati_users SET
      email = COALESCE(p_email, email),
      thirdweb_account_id = COALESCE(p_thirdweb_account_id, thirdweb_account_id),
      provider = COALESCE(p_provider, provider),
      provider_user_id = COALESCE(p_provider_user_id, provider_user_id),
      name = COALESCE(p_name, name),
      avatar_url = COALESCE(p_avatar_url, avatar_url),
      last_active_at = NOW(),
      updated_at = NOW()
    WHERE id = v_user_id;
    
    RETURN v_user_id;
  END IF;
  
  -- Si no existe, crear
  INSERT INTO sati_users (
    email, 
    thirdweb_account_id, 
    provider, 
    provider_user_id,
    name, 
    avatar_url
  )
  VALUES (
    p_email,
    p_thirdweb_account_id,
    p_provider,
    p_provider_user_id,
    p_name,
    p_avatar_url
  )
  RETURNING id INTO v_user_id;
  
  -- Crear registro de tokens
  INSERT INTO sati_tokens (user_id) VALUES (v_user_id);
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON sati_lesson_progress(user_id, completed);

-- Tabla de tokens $SATI
CREATE TABLE IF NOT EXISTS sati_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES sati_users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(18, 8) DEFAULT 0,
  total_earned DECIMAL(18, 8) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Tabla de badges desbloqueados
CREATE TABLE IF NOT EXISTS sati_user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES sati_users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON sati_user_badges(user_id);

-- Verificar
SELECT '✅ Tablas de Sati Academy creadas (Web2)' as status;
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE 'sati_%'
ORDER BY table_name;
