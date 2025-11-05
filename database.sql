-- ============================================
-- Script de Base de Datos Completo
-- Proyecto: Conexión Rural 360
-- Versión: 1.0
-- Fecha: Enero 2025
-- ============================================

-- Crear la base de datos (ejecutar como superusuario postgres)
-- CREATE DATABASE conexion_rural;

-- Conectar a la base de datos
-- \c conexion_rural;

-- ============================================
-- TABLA: users (Usuarios del sistema)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Comentarios para users
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema con roles (admin/user)';
COMMENT ON COLUMN users.username IS 'Nombre de usuario único';
COMMENT ON COLUMN users.email IS 'Email único del usuario';
COMMENT ON COLUMN users.password IS 'Contraseña hasheada con bcrypt';
COMMENT ON COLUMN users.role IS 'Rol del usuario: admin o user';
COMMENT ON COLUMN users.is_active IS 'Indica si el usuario está activo';

-- ============================================
-- TABLA: analytics (Métricas de analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  source TEXT NOT NULL,
  medium TEXT,
  campaign TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  is_new_user BOOLEAN NOT NULL DEFAULT true,
  device_type TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  time_on_page INTEGER DEFAULT 0,
  bounced BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT,
  conversion_value INTEGER,
  country TEXT,
  city TEXT,
  visited_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para analytics
CREATE INDEX IF NOT EXISTS idx_analytics_page_url ON analytics(page_url);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_visited_at ON analytics(visited_at);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON analytics(source);
CREATE INDEX IF NOT EXISTS idx_analytics_device_type ON analytics(device_type);

-- Comentarios para analytics
COMMENT ON TABLE analytics IS 'Tabla de métricas y analytics del sitio';
COMMENT ON COLUMN analytics.source IS 'Fuente de tráfico: organic, social, direct, referral';
COMMENT ON COLUMN analytics.device_type IS 'Tipo de dispositivo: mobile, desktop, tablet';
COMMENT ON COLUMN analytics.time_on_page IS 'Tiempo en la página en segundos';

-- ============================================
-- TABLA: page_content (Contenido CMS de la página principal)
-- ============================================
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  background_type TEXT DEFAULT 'gradient',
  button_text TEXT,
  button_link TEXT,
  button2_text TEXT,
  button2_link TEXT,
  -- Cards de estadísticas (3 cards en el hero)
  card1_number INTEGER,
  card1_label TEXT,
  card1_description TEXT,
  card2_number INTEGER,
  card2_label TEXT,
  card2_description TEXT,
  card3_number INTEGER,
  card3_label TEXT,
  card3_description TEXT,
  -- Instituciones educativas (2 cards)
  inst1_title TEXT,
  inst1_description TEXT,
  inst1_link TEXT,
  inst1_image TEXT,
  inst2_title TEXT,
  inst2_description TEXT,
  inst2_link TEXT,
  inst2_image TEXT,
  -- About section - Features (4 características)
  feature1_text TEXT,
  feature2_text TEXT,
  feature3_text TEXT,
  feature4_text TEXT,
  -- Team section - Investigador Principal
  lead_name TEXT,
  lead_role TEXT,
  lead_bio TEXT,
  lead_email TEXT,
  lead_photo TEXT,
  -- Team section - 3 Cards secundarias
  team_card1_title TEXT,
  team_card1_description TEXT,
  team_card2_title TEXT,
  team_card2_description TEXT,
  team_card3_title TEXT,
  team_card3_description TEXT,
  -- Phases section - Fase 1 (CONECTAR)
  phase1_number INTEGER,
  phase1_title TEXT,
  phase1_description TEXT,
  phase1_sub1_title TEXT,
  phase1_sub1_description TEXT,
  phase1_sub2_title TEXT,
  phase1_sub2_description TEXT,
  -- Phases section - Fase 2 (CONSTRUIR)
  phase2_number INTEGER,
  phase2_title TEXT,
  phase2_description TEXT,
  phase2_sub1_title TEXT,
  phase2_sub1_description TEXT,
  phase2_sub2_title TEXT,
  phase2_sub2_description TEXT,
  phase2_sub3_title TEXT,
  phase2_box1_title TEXT,
  phase2_box1_items TEXT,
  phase2_box2_title TEXT,
  phase2_box2_items TEXT,
  -- Phases section - Fase 3 (MAPEO)
  phase3_number INTEGER,
  phase3_title TEXT,
  phase3_description TEXT,
  phase3_sub1_title TEXT,
  phase3_sub1_description TEXT,
  phase3_sub2_title TEXT,
  phase3_sub2_description TEXT,
  phase3_box_title TEXT,
  phase3_box_items TEXT,
  -- Footer section (contact)
  footer_title TEXT,
  footer_description TEXT,
  footer_instit_title TEXT,
  footer_instit1 TEXT,
  footer_instit2 TEXT,
  footer_instit3 TEXT,
  footer_copyright TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para page_content
CREATE INDEX IF NOT EXISTS idx_page_content_section ON page_content(section);
CREATE INDEX IF NOT EXISTS idx_page_content_is_visible ON page_content(is_visible);
CREATE INDEX IF NOT EXISTS idx_page_content_order ON page_content("order");

-- Comentarios para page_content
COMMENT ON TABLE page_content IS 'Tabla de contenido CMS de la página principal';
COMMENT ON COLUMN page_content.section IS 'Sección de la página: hero, about, team, phases, contact, etc.';
COMMENT ON COLUMN page_content.background_type IS 'Tipo de fondo: gradient o image';
COMMENT ON COLUMN page_content.video_url IS 'URL del video (mantenido por compatibilidad)';

-- ============================================
-- TABLA: downloadable_materials (Materiales descargables)
-- ============================================
CREATE TABLE IF NOT EXISTS downloadable_materials (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size TEXT,
  file_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para downloadable_materials
CREATE INDEX IF NOT EXISTS idx_downloadable_materials_is_active ON downloadable_materials(is_active);
CREATE INDEX IF NOT EXISTS idx_downloadable_materials_order ON downloadable_materials("order");

-- Comentarios para downloadable_materials
COMMENT ON TABLE downloadable_materials IS 'Tabla de materiales descargables para la sección de recursos';
COMMENT ON COLUMN downloadable_materials.file_type IS 'Tipo de archivo: PDF, ZIP, XLSX, VIDEO, IMAGE, etc.';
COMMENT ON COLUMN downloadable_materials.file_size IS 'Tamaño del archivo (ej: 2.5 MB, 15 MB)';

-- ============================================
-- TABLA: gallery_items (Galería interactiva)
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para gallery_items
CREATE INDEX IF NOT EXISTS idx_gallery_items_is_active ON gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON gallery_items("order");

-- Comentarios para gallery_items
COMMENT ON TABLE gallery_items IS 'Tabla de items de la galería interactiva';
COMMENT ON COLUMN gallery_items.video_url IS 'URL del video (opcional) a donde redirige al hacer click';

-- ============================================
-- TABLA: material_downloads (Tracking de descargas)
-- ============================================
CREATE TABLE IF NOT EXISTS material_downloads (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES downloadable_materials(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  device_type TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  downloaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para material_downloads
CREATE INDEX IF NOT EXISTS idx_material_downloads_material_id ON material_downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_material_downloads_downloaded_at ON material_downloads(downloaded_at);
CREATE INDEX IF NOT EXISTS idx_material_downloads_session_id ON material_downloads(session_id);

-- Comentarios para material_downloads
COMMENT ON TABLE material_downloads IS 'Tabla para trackear descargas de materiales descargables';
COMMENT ON COLUMN material_downloads.device_type IS 'Tipo de dispositivo: mobile, desktop, tablet';

-- ============================================
-- TABLA: video_views (Tracking de reproducciones de videos)
-- ============================================
CREATE TABLE IF NOT EXISTS video_views (
  id SERIAL PRIMARY KEY,
  gallery_item_id INTEGER NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  device_type TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  viewed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para video_views
CREATE INDEX IF NOT EXISTS idx_video_views_gallery_item_id ON video_views(gallery_item_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON video_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_video_views_session_id ON video_views(session_id);

-- Comentarios para video_views
COMMENT ON TABLE video_views IS 'Tabla para trackear reproducciones de videos de la galería interactiva';
COMMENT ON COLUMN video_views.device_type IS 'Tipo de dispositivo: mobile, desktop, tablet';

-- ============================================
-- Verificación de tablas creadas
-- ============================================
SELECT 'Base de datos configurada correctamente' AS status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'users', 
    'analytics', 
    'page_content', 
    'downloadable_materials', 
    'gallery_items', 
    'material_downloads', 
    'video_views'
  )
ORDER BY table_name;

