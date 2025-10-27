-- Migración para agregar campos al CMS para la sección Hero
-- Ejecutar este script en la base de datos

-- Agregar columna para URL del video
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Agregar columna para tipo de fondo (video o imagen)
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'video';

-- Agregar columnas para el segundo botón
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS button2_text TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS button2_link TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN page_content.video_url IS 'URL del video de fondo para la sección Hero';
COMMENT ON COLUMN page_content.background_type IS 'Tipo de fondo: "video" o "image"';
COMMENT ON COLUMN page_content.button2_text IS 'Texto del segundo botón de acción';
COMMENT ON COLUMN page_content.button2_link IS 'Enlace del segundo botón de acción';

-- Actualizar la sección hero existente con valores por defecto
UPDATE page_content 
SET 
  video_url = '/attached_assets/IMG_8988_1754364438033.MP4',
  background_type = 'video',
  button2_text = 'Ver Video',
  button2_link = '#video'
WHERE section = 'hero';

-- Mensaje de confirmación
SELECT 'Migración completada exitosamente. Nuevos campos agregados a page_content.' AS status;

