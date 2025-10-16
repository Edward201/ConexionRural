// Script para verificar el contenido en la base de datos
import { config } from 'dotenv';
import pg from 'pg';

config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkContent() {
  try {
    console.log('🔍 Verificando contenido en la base de datos...\n');
    
    const result = await pool.query(
      'SELECT id, section, title, substring(description, 1, 50) as description, is_visible, "order" FROM page_content ORDER BY "order"'
    );
    
    if (result.rows.length === 0) {
      console.log('❌ No hay secciones en la base de datos');
      console.log('\n💡 Ejecuta: npm run db:seed-content');
    } else {
      console.log(`✅ Encontradas ${result.rows.length} secciones:\n`);
      result.rows.forEach(row => {
        console.log(`  ${row.order}. [${row.section}] ${row.title || '(sin título)'}`);
        console.log(`     Visible: ${row.is_visible ? '✓' : '✗'}`);
        console.log(`     ID: ${row.id}\n`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkContent();

