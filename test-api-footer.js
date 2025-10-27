/**
 * Test de la API para verificar que retorna los campos del footer
 */

async function testAPI() {
  try {
    console.log('🔍 Testeando API: GET /api/content\n');
    
    const response = await fetch('http://localhost:5000/api/content');
    const data = await response.json();
    
    const contactSection = data.contents?.find(c => c.section === 'contact');
    
    if (!contactSection) {
      console.log('⚠️  No se encontró la sección contact');
      return;
    }
    
    console.log('✅ Sección contact encontrada:\n');
    console.log('📋 CAMPOS BÁSICOS:');
    console.log(`  title: ${contactSection.title || 'undefined'}`);
    console.log(`  subtitle: ${contactSection.subtitle || 'undefined'}`);
    console.log(`  content: ${contactSection.content || 'undefined'}`);
    console.log(`  description: ${contactSection.description || 'undefined'}`);
    
    console.log('\n🎨 CAMPOS DEL FOOTER:');
    console.log(`  footerTitle: ${contactSection.footerTitle || 'undefined'}`);
    console.log(`  footerDescription: ${contactSection.footerDescription || 'undefined'}`);
    console.log(`  footerInstitTitle: ${contactSection.footerInstitTitle || 'undefined'}`);
    console.log(`  footerInstit1: ${contactSection.footerInstit1 || 'undefined'}`);
    console.log(`  footerInstit2: ${contactSection.footerInstit2 || 'undefined'}`);
    console.log(`  footerInstit3: ${contactSection.footerInstit3 || 'undefined'}`);
    console.log(`  footerCopyright: ${contactSection.footerCopyright || 'undefined'}`);
    
    if (!contactSection.footerTitle) {
      console.log('\n⚠️  PROBLEMA: Los campos del footer NO están siendo retornados por la API');
      console.log('💡 SOLUCIÓN: Reinicia el servidor para que Drizzle cargue el schema actualizado');
    } else {
      console.log('\n✅ La API está retornando correctamente los campos del footer');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();

