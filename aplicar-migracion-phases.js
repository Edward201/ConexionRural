/**
 * Script para aplicar la migración de Phases (Fases del Proyecto)
 */

// Cargar variables de entorno
import 'dotenv/config';
import { readFileSync } from 'fs';
import pg from 'pg';
const { Pool } = pg;

async function aplicarMigracion() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definido en el archivo .env');
    process.exit(1);
  }

  console.log('🔄 Conectando a la base de datos...');
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Leer el archivo SQL
    const sql = readFileSync('./database-migration-phases.sql', 'utf8');
    
    console.log('📝 Ejecutando migración de Phases...\n');
    
    // Ejecutar la migración
    await pool.query(sql);
    
    console.log('✅ Migración completada exitosamente!');
    console.log('\n📊 Columnas agregadas para FASE 1 - CONECTAR:');
    console.log('  - phase1_number, phase1_title, phase1_description');
    console.log('  - phase1_sub1_title, phase1_sub1_description');
    console.log('  - phase1_sub2_title, phase1_sub2_description');
    console.log('\n📊 Columnas agregadas para FASE 2 - CONSTRUIR:');
    console.log('  - phase2_number, phase2_title, phase2_description');
    console.log('  - phase2_sub1_title, phase2_sub1_description');
    console.log('  - phase2_sub2_title, phase2_sub2_description');
    console.log('  - phase2_sub3_title');
    console.log('  - phase2_box1_title, phase2_box1_items');
    console.log('  - phase2_box2_title, phase2_box2_items');
    console.log('\n📊 Columnas agregadas para FASE 3 - MAPEO GENERAL:');
    console.log('  - phase3_number, phase3_title, phase3_description');
    console.log('  - phase3_sub1_title, phase3_sub1_description');
    console.log('  - phase3_sub2_title, phase3_sub2_description');
    console.log('  - phase3_box_title, phase3_box_items');
    console.log('\n✨ Sección "phases" creada con valores por defecto');
    
  } catch (error) {
    console.error('❌ Error al aplicar la migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

aplicarMigracion();


