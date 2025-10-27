/**
 * Script para aplicar la migración de instituciones educativas del Hero
 * Agrega campos para las 2 cards de instituciones
 */

// Cargar variables de entorno
import 'dotenv/config';
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function aplicarMigracion() {
  console.log('🔄 Iniciando migración de Instituciones del Hero...\n');

  try {
    console.log('📋 Agregando columnas para las Instituciones...');

    // Agregar columnas para Institución 1
    try {
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst1_title TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst1_description TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst1_link TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst1_image TEXT;`);
      console.log('✅ Columnas de Institución 1 agregadas');
    } catch (e) {
      console.log('ℹ️  Columnas de Institución 1 ya existen');
    }

    // Agregar columnas para Institución 2
    try {
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst2_title TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst2_description TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst2_link TEXT;`);
      await db.execute(sql`ALTER TABLE page_content ADD COLUMN IF NOT EXISTS inst2_image TEXT;`);
      console.log('✅ Columnas de Institución 2 agregadas');
    } catch (e) {
      console.log('ℹ️  Columnas de Institución 2 ya existen');
    }

    console.log('\n📝 Actualizando datos de la sección hero con valores por defecto...');

    // Actualizar la sección hero con valores por defecto
    await db.execute(sql`
      UPDATE page_content 
      SET 
        inst1_title = COALESCE(inst1_title, 'Escuela Rural Multigrado El Volcán'),
        inst1_description = COALESCE(inst1_description, 'Pertenece a la IEDRI (Institución Educativa Departamental Rural Integral) Mundo Nuevo. Ubicada en el municipio de La Calera, a 30 minutos del caso urbano.'),
        inst1_link = COALESCE(inst1_link, 'https://maps.app.goo.gl/Fcsp5Vgh5TwR2jdw9'),
        inst2_title = COALESCE(inst2_title, 'Colegio Nuevo San Andrés de los Altos'),
        inst2_description = COALESCE(inst2_description, 'Ubicado en la localidad de Usme – Bogotá.'),
        inst2_link = COALESCE(inst2_link, 'https://maps.app.goo.gl/dkAQDTc6QuLoyvsx8')
      WHERE section = 'hero';
    `);

    console.log('✅ Datos de las instituciones actualizados');

    console.log('\n🎉 ¡Migración completada exitosamente!\n');
    console.log('📌 Próximos pasos:');
    console.log('   1. Recarga el CMS en el navegador');
    console.log('   2. Edita la sección "hero"');
    console.log('   3. Verás una nueva sección TEAL (verde azulado) para administrar las 2 instituciones\n');
    console.log('💡 Ahora puedes controlar para cada institución:');
    console.log('   - Título');
    console.log('   - Descripción');
    console.log('   - Link de ubicación (Google Maps)');
    console.log('   - Imagen de fondo (opcional)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al aplicar la migración:', error);
    console.error('\n💡 Puedes aplicar la migración manualmente ejecutando:');
    console.error('   psql -U tu_usuario -d tu_base_de_datos -f database-migration-instituciones.sql\n');
    process.exit(1);
  }
}

aplicarMigracion();

