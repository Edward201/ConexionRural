/**
 * Script para aplicar la migración de Team
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
    const sql = readFileSync('./database-migration-team.sql', 'utf8');
    
    console.log('📝 Ejecutando migración de Team...\n');
    
    // Ejecutar la migración
    await pool.query(sql);
    
    console.log('✅ Migración completada exitosamente!');
    console.log('\n📊 Columnas agregadas para Investigador Principal:');
    console.log('  - lead_name');
    console.log('  - lead_role');
    console.log('  - lead_bio');
    console.log('  - lead_email');
    console.log('  - lead_photo');
    console.log('\n📊 Columnas agregadas para Cards del Equipo:');
    console.log('  - team_card1_title, team_card1_description');
    console.log('  - team_card2_title, team_card2_description');
    console.log('  - team_card3_title, team_card3_description');
    console.log('\n✨ Valores por defecto aplicados a la sección "team"');
    
  } catch (error) {
    console.error('❌ Error al aplicar la migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

aplicarMigracion();

