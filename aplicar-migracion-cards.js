/**
 * Script para aplicar la migración de cards del Hero
 * Agrega campos para las 3 cards y ajusta el tipo de fondo
 */

// Cargar variables de entorno
import 'dotenv/config';
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function aplicarMigracion() {
  console.log('🔄 Iniciando migración de Cards del Hero...\n');

  try {
    // Cambiar valores de background_type (mantenemos video_url por compatibilidad)
    await db.execute(sql`
      UPDATE page_content 
      SET background_type = 'gradient' 
      WHERE background_type = 'video' OR background_type IS NULL;
    `);
    console.log('✅ Tipo de fondo actualizado a "gradient" (video_url se mantiene por compatibilidad)');

    console.log('\n📋 Agregando columnas para las Cards...');

    // Agregar columnas para Card 1
    try {
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card1_number INTEGER;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card1_label TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card1_description TEXT;`);
      console.log('✅ Columnas de Card 1 agregadas');
    } catch (e) {
      console.log('ℹ️  Columnas de Card 1 ya existen');
    }

    // Agregar columnas para Card 2
    try {
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card2_number INTEGER;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card2_label TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card2_description TEXT;`);
      console.log('✅ Columnas de Card 2 agregadas');
    } catch (e) {
      console.log('ℹ️  Columnas de Card 2 ya existen');
    }

    // Agregar columnas para Card 3
    try {
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card3_number INTEGER;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card3_label TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS card3_description TEXT;`);
      console.log('✅ Columnas de Card 3 agregadas');
    } catch (e) {
      console.log('ℹ️  Columnas de Card 3 ya existen');
    }

    console.log('\n📝 Actualizando datos de la sección hero con valores por defecto...');

    // Actualizar la sección hero con valores por defecto
    await db.execute(sql`
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
    `);

    console.log('✅ Datos de la sección hero actualizados con valores por defecto');

    console.log('\n🎉 ¡Migración completada exitosamente!\n');
    console.log('📌 Próximos pasos:');
    console.log('   1. Reinicia el servidor si está corriendo');
    console.log('   2. Accede al Dashboard como admin');
    console.log('   3. Ve a "Gestión de Contenido"');
    console.log('   4. Edita la sección "hero" para ver los nuevos campos de Cards\n');
    console.log('💡 Ahora puedes controlar:');
    console.log('   - Tipo de fondo (Gradiente naranja o Imagen)');
    console.log('   - Textos de los 2 botones');
    console.log('   - Las 3 cards de estadísticas (número, etiqueta y descripción)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al aplicar la migración:', error);
    console.error('\n💡 Puedes aplicar la migración manualmente ejecutando:');
    console.error('   psql -U tu_usuario -d tu_base_de_datos -f database-migration-cards.sql\n');
    process.exit(1);
  }
}

aplicarMigracion();

