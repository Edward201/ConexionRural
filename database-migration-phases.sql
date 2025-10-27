-- Migración para agregar campos de la sección Phases (Fases del Proyecto)
-- Fecha: 2025-10-26

-- FASE 1 - CONECTAR
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_number INTEGER;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_sub1_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_sub1_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_sub2_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase1_sub2_description TEXT;

-- FASE 2 - CONSTRUIR
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_number INTEGER;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_sub1_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_sub1_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_sub2_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_sub2_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_sub3_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_box1_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_box1_items TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_box2_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase2_box2_items TEXT;

-- FASE 3 - MAPEO GENERAL
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_number INTEGER;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_sub1_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_sub1_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_sub2_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_sub2_description TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_box_title TEXT;
ALTER TABLE page_content ADD COLUMN IF NOT EXISTS phase3_box_items TEXT;

-- Insertar datos por defecto para la sección phases (si no existe)
INSERT INTO page_content (
  section, title, subtitle, is_visible, "order",
  phase1_number, phase1_title, phase1_description,
  phase1_sub1_title, phase1_sub1_description,
  phase1_sub2_title, phase1_sub2_description,
  phase2_number, phase2_title, phase2_description,
  phase2_sub1_title, phase2_sub1_description,
  phase2_sub2_title, phase2_sub2_description,
  phase2_sub3_title, phase2_box1_title, phase2_box1_items,
  phase2_box2_title, phase2_box2_items,
  phase3_number, phase3_title, phase3_description,
  phase3_sub1_title, phase3_sub1_description,
  phase3_sub2_title, phase3_sub2_description,
  phase3_box_title, phase3_box_items
)
SELECT 
  'phases',
  'Fases del Proyecto',
  'Metodología de trabajo en tres fases',
  true,
  3,
  1, 'CONECTAR', 'Fase inicial de revisión documental, reconocimiento territorial y construcción de talleres.',
  'Revisión documental', 'Estudio teórico de antecedentes y para consolidar el marco categorial: Bilingüismo, Pensamiento computacional, Formación de ciudadanías y Educación para la paz.',
  'Reconocimiento territorial', 'Visita a las Instituciones Educativas para identificar dinámicas, presentación del equipo a directivos y docentes, presentación de la investigación y llegar a acuerdos metodológicos.',
  2, 'CONSTRUIR - LA CALERA', 'Implementación de talleres, levantamiento de requerimientos y desarrollo de contenidos contextualizados.',
  'Talleres de asentimiento informado', 'Como apuesta onto-epistemológica, se realizaron jornadas explicativas y consultivas con los niños y niñas participantes para obtener sus permisos y alcances de participación.',
  'Talleres de línea base', 'Jornadas con los estudiantes para conocer sus saberes previos sobre los cuatro ejes temáticos: Bilingüismo, Pensamiento computacional, Formación de ciudadanías y Educación para la paz.',
  'Talleres de saberes propios', 'Formación de Ciudadanías', E'Taller sobre participación\nTaller sobre territorio\nTaller sobre memoria colectiva',
  'Educación para la Paz', E'Taller sobre ética del cuidado\nTaller sobre justicia\nTaller sobre memoria colectiva',
  3, 'MAPEO GENERAL', 'Análisis de datos, creación de la plataforma y apropiación social del conocimiento.',
  'Identificación de Temas, Intereses y Necesidades', 'Se analizan los diarios de campo de cada taller y visita para triangular contenidos y hallar pistas para los hilos temáticos de la plataforma educativa.',
  'Creación de la malla curricular', 'Se crea la propuesta curricular de la plataforma validando con maestras titulares los Estándares Básicos de Competencias y los Derechos Básicos de Aprendizaje.',
  'Apropiación Social del Conocimiento', E'Presentación en evento académico internacional\nPresentación ante pares académicos institucionales\nParticipación en programa radial'
WHERE NOT EXISTS (SELECT 1 FROM page_content WHERE section = 'phases');

-- Confirmar cambios
SELECT 'Columnas de Phases agregadas exitosamente' AS mensaje;


