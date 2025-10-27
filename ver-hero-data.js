/**
 * Script para ver los datos actuales de la sección hero
 */

// Cargar variables de entorno
import 'dotenv/config';
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function verDatos() {
  console.log('🔍 Consultando datos de la sección hero...\n');

  try {
    const result = await db.execute(sql`
      SELECT * FROM page_content WHERE section = 'hero'
    `);

    if (result.rows.length === 0) {
      console.log('❌ No se encontró la sección hero');
    } else {
      const hero = result.rows[0];
      console.log('✅ Sección Hero encontrada:\n');
      console.log('ID:', hero.id);
      console.log('Título:', hero.title);
      console.log('Subtítulo:', hero.subtitle);
      console.log('\n--- CARDS ---');
      console.log('Card1:', hero.card1_number, '|', hero.card1_label, '|', hero.card1_description);
      console.log('Card2:', hero.card2_number, '|', hero.card2_label, '|', hero.card2_description);
      console.log('Card3:', hero.card3_number, '|', hero.card3_label, '|', hero.card3_description);
      console.log('\n--- INSTITUCIONES ---');
      console.log('Inst1:', hero.inst1_title);
      console.log('  Desc:', hero.inst1_description);
      console.log('  Link:', hero.inst1_link);
      console.log('Inst2:', hero.inst2_title);
      console.log('  Desc:', hero.inst2_description);
      console.log('  Link:', hero.inst2_link);
      console.log('\n--- BOTONES ---');
      console.log('Botón 1:', hero.button_text, '→', hero.button_link);
      console.log('Botón 2:', hero.button2_text, '→', hero.button2_link);
      console.log('\n--- OTROS ---');
      console.log('Visible:', hero.is_visible);
      console.log('Background:', hero.background_type);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verDatos();

