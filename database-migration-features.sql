-- Migración para agregar campos de características (features) de la sección About
-- Fecha: 2025-10-26

-- Agregar columnas para las 4 características con íconos
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS feature1_text TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS feature2_text TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS feature3_text TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS feature4_text TEXT;

-- Actualizar la sección about con valores por defecto
UPDATE page_content 
SET 
  feature1_text = 'Contenidos territorializados',
  feature2_text = 'Herramientas de gamificación',
  feature3_text = 'Capacitaciones para toda la comunidad educativa',
  feature4_text = 'Adaptado a condiciones rurales de conectividad'
WHERE section = 'about' 
  AND feature1_text IS NULL;

-- Confirmar cambios
SELECT 'Columnas de features agregadas exitosamente' AS mensaje;

