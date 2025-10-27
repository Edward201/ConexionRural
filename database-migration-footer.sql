-- Migración para agregar campos del Footer (sección contact)
-- Fecha: 2025-10-27

-- Agregar columnas del footer
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_instit_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_instit1 TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_instit2 TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_instit3 TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS footer_copyright TEXT;

-- Actualizar la sección contact con valores por defecto del footer
UPDATE page_content
SET 
  footer_title = 'Conexión Rural 360',
  footer_description = 'Educando en Contexto - Una investigación que transforma la educación rural a través de la tecnología y contenidos territorializados.',
  footer_instit_title = 'Instituciones Participantes',
  footer_instit1 = 'IEDRI Mundo Nuevo - La Calera',
  footer_instit2 = 'Colegio Nuevo San Andrés de los Altos - Usme',
  footer_instit3 = 'Universidad Compensar',
  footer_copyright = '© 2025 Conexión Rural 360. Todos los derechos reservados.'
WHERE section = 'contact';

-- Confirmar cambios
SELECT 'Columnas del Footer agregadas exitosamente' AS mensaje;

