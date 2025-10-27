/**
 * Script para ver todas las secciones en la base de datos
 */

import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function verSecciones() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definido');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log('🔍 Consultando secciones en la base de datos...\n');
    
    const result = await pool.query(`
      SELECT 
        id, 
        section, 
        title, 
        is_visible, 
        "order",
        updated_at
      FROM page_content 
      ORDER BY "order" ASC
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No hay secciones en la base de datos');
      console.log('\n💡 Ejecuta: npm run db:seed-content');
    } else {
      console.log(`✅ Encontradas ${result.rows.length} secciones:\n`);
      result.rows.forEach(row => {
        console.log(`  ${row.id}. [${row.section}] ${row.title || '(sin título)'}`);
        console.log(`     Visible: ${row.is_visible ? '✓' : '✗'} | Orden: ${row.order} | Actualizado: ${new Date(row.updated_at).toLocaleDateString()}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verSecciones();

