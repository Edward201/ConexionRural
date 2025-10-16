// Script para poblar la tabla page_content con el contenido REAL de la página de inicio
// Este contenido coincide EXACTAMENTE con lo que está actualmente en home.tsx

import "dotenv/config";
import { db } from "./db";
import { pageContent } from "@shared/schema";

async function seedContent() {
  console.log("🌱 Generando contenido de la página de inicio...");

  try {
    // Limpiar contenido existente
    console.log("🗑️  Limpiando contenido existente...");
    await db.delete(pageContent);
    
    const contents = [
      // HERO SECTION - Banner principal con video de fondo
      {
        section: "hero",
        title: "Conexión Rural 360",
        subtitle: "Educando en Contexto",
        description: "Una apuesta investigativa para fortalecer la educación desde la creación de una plataforma educativa híbrida con contenidos territorializados.",
        buttonText: "Conocer más",
        buttonLink: "/proyecto",
        isVisible: true,
        order: 1,
      },

      // ABOUT SECTION - Sobre el Proyecto
      {
        section: "about",
        title: "Sobre el Proyecto",
        subtitle: "Conexión Rural 360: Educando en Contexto",
        description: "Es una investigación desarrollada desde febrero de 2025 que, a través de la estrategia de Cartografía Social Infantil, mapeó los intereses, temas y necesidades de niñas y niños de dos instituciones educativas rurales. A partir de estos hallazgos, se diseñaron y produjeron contenidos educativos contextualizados desde la ruralidad, integrados en una plataforma híbrida tipo MOOC que promueve el acceso al aprendizaje desde y para los territorios.",
        content: "Determinar el impacto de la implementación de esta plataforma educativa en el fortalecimiento de habilidades digitales en comunidades rurales y en el desarrollo de aprendizajes significativos en torno a la Cultura de paz, la Construcción de ciudadanías, los Idiomas y el Pensamiento computacional.",
        buttonText: "Objetivo General",
        isVisible: true,
        order: 2,
      },

      // TEAM SECTION - Equipo
      {
        section: "team",
        title: "¿Quiénes somos?",
        subtitle: "Somos un grupo de profesionales multidisciplinares que cree en la educación como motor de cambio social.",
        description: "Equipo de investigación multidisciplinario",
        isVisible: true,
        order: 3,
      },

      // CONTACT SECTION - Footer
      {
        section: "contact",
        title: "Contacto",
        subtitle: "Teresila Barona Villamizar",
        description: "Universidad Compensar",
        content: "ltbarona@ucompensar.edu.co",
        isVisible: true,
        order: 4,
      },
    ];

    console.log(`📊 Insertando ${contents.length} secciones editables...`);

    for (const content of contents) {
      await db.insert(pageContent).values(content);
      console.log(`   ✓ Sección "${content.section}" creada`);
    }

    console.log("\n✅ Contenido de la página de inicio creado exitosamente");
    console.log(`   Total secciones editables: ${contents.length}`);
    console.log("\n📝 Ahora puedes editar estas secciones desde http://localhost:5000/content");
    console.log("\n🎯 Secciones disponibles:");
    console.log("   • hero     → Banner principal (título, subtítulo, descripción)");
    console.log("   • about    → Sobre el Proyecto (descripción y objetivo)");
    console.log("   • team     → Título y descripción del equipo");
    console.log("   • contact  → Información de contacto (footer)");
    console.log("\n💡 Para editar:");
    console.log("   1. Ve a http://localhost:5000/content");
    console.log("   2. Login: admin / admin123");
    console.log("   3. Busca la sección y edita");
    console.log("   4. Refresca http://localhost:5000 para ver cambios");

  } catch (error) {
    console.error("❌ Error al generar contenido:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedContent();
