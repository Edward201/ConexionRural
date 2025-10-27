/**
 * Diagnóstico completo del problema
 */

import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function diagnostico() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definido');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log('🔍 DIAGNÓSTICO COMPLETO\n');
    console.log('=' .repeat(60));
    
    // 1. Verificar columnas de la tabla
    console.log('\n1️⃣  ESTRUCTURA DE LA TABLA page_content:');
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'page_content' 
      AND column_name LIKE 'footer%'
      ORDER BY column_name
    `);
    
    if (columns.rows.length === 0) {
      console.log('   ❌ NO SE ENCONTRARON columnas del footer');
      console.log('   💡 Ejecuta: npm run db:migrate-footer');
    } else {
      console.log('   ✅ Columnas del footer encontradas:');
      columns.rows.forEach(col => {
        console.log(`      - ${col.column_name} (${col.data_type})`);
      });
    }
    
    // 2. Verificar datos en la sección contact
    console.log('\n2️⃣  DATOS EN LA SECCIÓN CONTACT:');
    const contact = await pool.query(`
      SELECT 
        footer_title,
        footer_description,
        footer_instit_title,
        footer_instit1,
        footer_copyright
      FROM page_content 
      WHERE section = 'contact'
    `);
    
    if (contact.rows.length === 0) {
      console.log('   ❌ No se encontró la sección contact');
    } else {
      const data = contact.rows[0];
      console.log(`   Footer Title: ${data.footer_title ? '✅ ' + data.footer_title : '❌ NULL'}`);
      console.log(`   Footer Description: ${data.footer_description ? '✅ Sí' : '❌ NULL'}`);
      console.log(`   Footer Instit Title: ${data.footer_instit_title ? '✅ ' + data.footer_instit_title : '❌ NULL'}`);
      console.log(`   Footer Instit 1: ${data.footer_instit1 ? '✅ ' + data.footer_instit1 : '❌ NULL'}`);
      console.log(`   Footer Copyright: ${data.footer_copyright ? '✅ Sí' : '❌ NULL'}`);
    }
    
    // 3. Verificar todas las secciones
    console.log('\n3️⃣  TODAS LAS SECCIONES:');
    const allSections = await pool.query(`
      SELECT id, section, title, is_visible 
      FROM page_content 
      ORDER BY "order"
    `);
    
    allSections.rows.forEach(s => {
      console.log(`   [${s.id}] ${s.section} - ${s.title} ${s.is_visible ? '👁️' : '🙈'}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 PASOS SIGUIENTES:');
    console.log('   1. Asegúrate de que el servidor esté detenido');
    console.log('   2. Ejecuta: npm run dev');
    console.log('   3. Recarga el navegador con Ctrl+Shift+R (hard reload)');
    console.log('   4. Ve al CMS y edita la sección "contact"');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

diagnostico();

