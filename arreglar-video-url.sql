-- Arreglar: Agregar columna video_url que fue eliminada por error
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Mensaje
SELECT 'Columna video_url agregada de vuelta' AS status;

