/**
 * Script para arreglar el problema de video_url
 * Agrega la columna de vuelta a la base de datos
 */

// Cargar variables de entorno
import 'dotenv/config';
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function arreglar() {
  console.log('🔧 Arreglando columna video_url...\n');

  try {
    // Agregar columna video_url
    await db.execute(sql`
      ALTER TABLE page_content 
      ADD COLUMN IF NOT EXISTS video_url TEXT;
    `);
    
    console.log('✅ Columna video_url agregada de vuelta a la base de datos');
    console.log('\n🎉 Problema solucionado!');
    console.log('📌 Ahora reinicia el servidor y todo debería funcionar.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

arreglar();

