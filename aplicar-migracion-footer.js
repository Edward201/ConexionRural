/**
 * Script para aplicar la migración del Footer (sección contact)
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
    const sql = readFileSync('./database-migration-footer.sql', 'utf8');
    
    console.log('📝 Ejecutando migración del Footer...\n');
    
    // Ejecutar la migración
    await pool.query(sql);
    
    console.log('✅ Migración completada exitosamente!');
    console.log('\n📊 Columnas agregadas al Footer:');
    console.log('  - footer_title (título del footer)');
    console.log('  - footer_description (descripción principal)');
    console.log('  - footer_instit_title (título de instituciones)');
    console.log('  - footer_instit1 (institución 1)');
    console.log('  - footer_instit2 (institución 2)');
    console.log('  - footer_instit3 (institución 3)');
    console.log('  - footer_copyright (texto de copyright)');
    console.log('\n✨ Sección "contact" actualizada con valores por defecto del footer');
    console.log('\n🎯 Ahora puedes editar el footer completo desde el CMS (sección contact)');
    
  } catch (error) {
    console.error('❌ Error al aplicar la migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

aplicarMigracion();

