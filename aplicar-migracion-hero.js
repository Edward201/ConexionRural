/**
 * Script para aplicar la migración de la base de datos
 * Agrega los nuevos campos para el CMS Hero mejorado
 */

// Cargar variables de entorno
import 'dotenv/config';
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function aplicarMigracion() {
  console.log('🔄 Iniciando migración de base de datos...\n');

  try {
    // Verificar si las columnas ya existen
    console.log('📋 Verificando columnas existentes...');
    
    // Agregar columna video_url
    try {
      await db.execute(sql`
        ALTER TABLE page_content 
        ADD COLUMN IF NOT EXISTS video_url TEXT;
      `);
      console.log('✅ Columna video_url agregada');
    } catch (e) {
      console.log('ℹ️  Columna video_url ya existe');
    }

    // Agregar columna background_type
    try {
      await db.execute(sql`
        ALTER TABLE page_content 
        ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'video';
      `);
      console.log('✅ Columna background_type agregada');
    } catch (e) {
      console.log('ℹ️  Columna background_type ya existe');
    }

    // Agregar columna button2_text
    try {
      await db.execute(sql`
        ALTER TABLE page_content 
        ADD COLUMN IF NOT EXISTS button2_text TEXT;
      `);
      console.log('✅ Columna button2_text agregada');
    } catch (e) {
      console.log('ℹ️  Columna button2_text ya existe');
    }

    // Agregar columna button2_link
    try {
      await db.execute(sql`
        ALTER TABLE page_content 
        ADD COLUMN IF NOT EXISTS button2_link TEXT;
      `);
      console.log('✅ Columna button2_link agregada');
    } catch (e) {
      console.log('ℹ️  Columna button2_link ya existe');
    }

    console.log('\n📝 Actualizando datos de la sección hero...');

    // Actualizar la sección hero existente con valores por defecto
    await db.execute(sql`
      UPDATE page_content 
      SET 
        video_url = COALESCE(video_url, '/attached_assets/IMG_8988_1754364438033.MP4'),
        background_type = COALESCE(background_type, 'video'),
        button2_text = COALESCE(button2_text, 'Ver Video'),
        button2_link = COALESCE(button2_link, '#video')
      WHERE section = 'hero';
    `);

    console.log('✅ Datos de la sección hero actualizados');

    console.log('\n🎉 ¡Migración completada exitosamente!\n');
    console.log('📌 Próximos pasos:');
    console.log('   1. Reinicia el servidor: npm run dev');
    console.log('   2. Accede al Dashboard como admin');
    console.log('   3. Ve a "Gestión de Contenido"');
    console.log('   4. Edita la sección "hero" para configurar el fondo y botones\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al aplicar la migración:', error);
    console.error('\n💡 Puedes aplicar la migración manualmente ejecutando:');
    console.error('   psql -U tu_usuario -d tu_base_de_datos -f database-migration-hero-fields.sql\n');
    process.exit(1);
  }
}

aplicarMigracion();

