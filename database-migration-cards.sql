-- Migración para agregar campos de Cards
-- Ejecutar este script en la base de datos

-- Cambiar valores de background_type de 'video' a 'gradient' (dejamos video_url por compatibilidad)
UPDATE page_content 
SET background_type = 'gradient' 
WHERE background_type = 'video' OR background_type IS NULL;

-- Agregar columnas para Card 1
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card1_number INTEGER;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card1_label TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card1_description TEXT;

-- Agregar columnas para Card 2
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card2_number INTEGER;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card2_label TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card2_description TEXT;

-- Agregar columnas para Card 3
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card3_number INTEGER;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card3_label TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS card3_description TEXT;

-- Actualizar la sección hero existente con valores por defecto para las cards
UPDATE page_content 
SET 
  card1_number = COALESCE(card1_number, 2),
  card1_label = COALESCE(card1_label, 'Participantes'),
  card1_description = COALESCE(card1_description, 'Instituciones Educativas'),
  card2_number = COALESCE(card2_number, 150),
  card2_label = COALESCE(card2_label, 'Beneficiados'),
  card2_description = COALESCE(card2_description, 'Estudiantes'),
  card3_number = COALESCE(card3_number, 4),
  card3_label = COALESCE(card3_label, 'Temáticas'),
  card3_description = COALESCE(card3_description, 'Ejes Temáticos'),
  background_type = COALESCE(background_type, 'gradient')
WHERE section = 'hero';

-- Comentarios para documentación
COMMENT ON COLUMN page_content.card1_number IS 'Número mostrado en la primera card de estadísticas';
COMMENT ON COLUMN page_content.card1_label IS 'Etiqueta/badge de la primera card';
COMMENT ON COLUMN page_content.card1_description IS 'Descripción de la primera card';
COMMENT ON COLUMN page_content.card2_number IS 'Número mostrado en la segunda card de estadísticas';
COMMENT ON COLUMN page_content.card2_label IS 'Etiqueta/badge de la segunda card';
COMMENT ON COLUMN page_content.card2_description IS 'Descripción de la segunda card';
COMMENT ON COLUMN page_content.card3_number IS 'Número mostrado en la tercera card de estadísticas';
COMMENT ON COLUMN page_content.card3_label IS 'Etiqueta/badge de la tercera card';
COMMENT ON COLUMN page_content.card3_description IS 'Descripción de la tercera card';

-- Mensaje de confirmación
SELECT 'Migración completada exitosamente. Cards agregadas y fondo actualizado.' AS status;

