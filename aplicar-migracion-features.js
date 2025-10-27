/**
 * Script para aplicar la migración de features de la sección About
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
    const sql = readFileSync('./database-migration-features.sql', 'utf8');
    
    console.log('📝 Ejecutando migración de features...\n');
    
    // Ejecutar la migración
    await pool.query(sql);
    
    console.log('✅ Migración completada exitosamente!');
    console.log('\n📊 Columnas agregadas:');
    console.log('  - feature1_text');
    console.log('  - feature2_text');
    console.log('  - feature3_text');
    console.log('  - feature4_text');
    console.log('\n✨ Valores por defecto aplicados a la sección "about"');
    
  } catch (error) {
    console.error('❌ Error al aplicar la migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

aplicarMigracion();

