-- Migración para agregar campos de la sección Team
-- Fecha: 2025-10-26

-- Agregar columnas para el Investigador Principal
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS lead_name TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS lead_role TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS lead_bio TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS lead_email TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS lead_photo TEXT;

-- Agregar columnas para las 3 cards del equipo
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS team_card1_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS team_card1_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS team_card2_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS team_card2_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS team_card3_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS team_card3_description TEXT;

-- Actualizar la sección team con valores por defecto
UPDATE page_content 
SET 
  lead_name = 'Teresila Barona Villamizar',
  lead_role = 'Investigadora Principal',
  lead_bio = 'Socióloga y Doctora en Educación, antioqueña y coordinó el proyecto en el semestre 2025-1.',
  lead_email = 'ltbarona@ucompensar.edu.co',
  lead_photo = '',
  team_card1_title = 'Coinvestigadores',
  team_card1_description = 'Equipo multidisciplinario de investigadores especializados',
  team_card2_title = 'Pasantes de Investigación',
  team_card2_description = 'Estudiantes en formación que apoyan el desarrollo del proyecto',
  team_card3_title = 'Comunidad Educativa',
  team_card3_description = 'Directivos, docentes y estudiantes participantes'
WHERE section = 'team' 
  AND lead_name IS NULL;

-- Confirmar cambios
SELECT 'Columnas de Team agregadas exitosamente' AS mensaje;

