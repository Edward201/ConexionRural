/**
 * Script para ver los datos de la sección contact/footer
 */

import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function verContactData() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definido');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log('🔍 Consultando datos de la sección contact...\n');
    
    const result = await pool.query(`
      SELECT 
        id,
        section,
        title,
        subtitle,
        content,
        description,
        footer_title,
        footer_description,
        footer_instit_title,
        footer_instit1,
        footer_instit2,
        footer_instit3,
        footer_copyright
      FROM page_content 
      WHERE section = 'contact'
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No se encontró la sección contact');
    } else {
      const contact = result.rows[0];
      console.log('✅ Datos de la sección CONTACT:\n');
      
      console.log('📋 CAMPOS BÁSICOS:');
      console.log(`  Title: ${contact.title || '(null)'}`);
      console.log(`  Subtitle: ${contact.subtitle || '(null)'}`);
      console.log(`  Content: ${contact.content || '(null)'}`);
      console.log(`  Description: ${contact.description || '(null)'}`);
      
      console.log('\n🎨 CAMPOS DEL FOOTER:');
      console.log(`  Footer Title: ${contact.footer_title || '(null)'}`);
      console.log(`  Footer Description: ${contact.footer_description || '(null)'}`);
      console.log(`  Footer Instit Title: ${contact.footer_instit_title || '(null)'}`);
      console.log(`  Footer Instit 1: ${contact.footer_instit1 || '(null)'}`);
      console.log(`  Footer Instit 2: ${contact.footer_instit2 || '(null)'}`);
      console.log(`  Footer Instit 3: ${contact.footer_instit3 || '(null)'}`);
      console.log(`  Footer Copyright: ${contact.footer_copyright || '(null)'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verContactData();

