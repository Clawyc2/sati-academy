-- Tabla de usuarios para Sati Academy
-- Autenticación mixta: Thirdweb (auth) + Supabase (datos)

CREATE TABLE IF NOT EXISTS sati_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT,
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
  preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sati_users_wallet ON sati_users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_sati_users_email ON sati_users(email);

-- RLS
ALTER TABLE sati_users ENABLE ROW LEVEL SECURITY;

-- Política: usuarios solo pueden ver/editar sus propios datos
CREATE POLICY "Users can view own data" ON sati_users
  FOR SELECT USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

CREATE POLICY "Users can update own data" ON sati_users
  FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- Función para crear/actualizar usuario desde Thirdweb
CREATE OR REPLACE FUNCTION upsert_sati_user(
  p_wallet_address TEXT,
  p_email TEXT DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO sati_users (wallet_address, email, name, avatar_url, last_active_at)
  VALUES (p_wallet_address, p_email, p_name, p_avatar_url, NOW())
  ON CONFLICT (wallet_address)
  DO UPDATE SET
    email = COALESCE(p_email, sati_users.email),
    name = COALESCE(p_name, sati_users.name),
    avatar_url = COALESCE(p_avatar_url, sati_users.avatar_url),
    last_active_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_user_id;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para permitir upsert desde anon (con wallet address válido)
CREATE POLICY "Allow anon upsert with wallet" ON sati_users
  FOR INSERT
  WITH CHECK (wallet_address IS NOT NULL AND wallet_address ~ '^0x[a-fA-F0-9]{40}$');

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

-- Tabla de tokens $SATI
CREATE TABLE IF NOT EXISTS sati_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES sati_users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(18, 8) DEFAULT 0,
  total_earned DECIMAL(18, 8) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de racha diaria
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
