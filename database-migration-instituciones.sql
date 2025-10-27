-- Migración para agregar campos de Instituciones al Hero
-- Ejecutar este script en la base de datos

-- Agregar columnas para Institución 1
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst1_title TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst1_description TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst1_link TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst1_image TEXT;

-- Agregar columnas para Institución 2
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst2_title TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst2_description TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst2_link TEXT;

ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS inst2_image TEXT;

-- Actualizar la sección hero con valores por defecto
UPDATE page_content 
SET 
  inst1_title = COALESCE(inst1_title, 'Escuela Rural Multigrado El Volcán'),
  inst1_description = COALESCE(inst1_description, 'Pertenece a la IEDRI (Institución Educativa Departamental Rural Integral) Mundo Nuevo. Ubicada en el municipio de La Calera, a 30 minutos del caso urbano.'),
  inst1_link = COALESCE(inst1_link, 'https://maps.app.goo.gl/Fcsp5Vgh5TwR2jdw9'),
  inst2_title = COALESCE(inst2_title, 'Colegio Nuevo San Andrés de los Altos'),
  inst2_description = COALESCE(inst2_description, 'Ubicado en la localidad de Usme – Bogotá.'),
  inst2_link = COALESCE(inst2_link, 'https://maps.app.goo.gl/dkAQDTc6QuLoyvsx8')
WHERE section = 'hero';

-- Comentarios para documentación
COMMENT ON COLUMN page_content.inst1_title IS 'Título de la primera institución educativa';
COMMENT ON COLUMN page_content.inst1_description IS 'Descripción de la primera institución';
COMMENT ON COLUMN page_content.inst1_link IS 'Link de ubicación de la primera institución';
COMMENT ON COLUMN page_content.inst1_image IS 'URL de imagen de fondo de la primera institución';
COMMENT ON COLUMN page_content.inst2_title IS 'Título de la segunda institución educativa';
COMMENT ON COLUMN page_content.inst2_description IS 'Descripción de la segunda institución';
COMMENT ON COLUMN page_content.inst2_link IS 'Link de ubicación de la segunda institución';
COMMENT ON COLUMN page_content.inst2_image IS 'URL de imagen de fondo de la segunda institución';

-- Mensaje de confirmación
SELECT 'Migración de instituciones completada exitosamente.' AS status;

