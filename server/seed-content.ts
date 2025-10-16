// Script to populate the page_content table with the REAL content of the home page
// This content EXACTLY matches what is currently in home.tsx

import "dotenv/config";
import { db } from "./db";
import { pageContent } from "@shared/schema";

/**
 * Seeds the database with the content of the home page.
 */
async function seedContent() {
  console.log("🌱 Generating home page content...");

  try {
    // Clear existing content
    console.log("🗑️  Clearing existing content...");
    await db.delete(pageContent);
    
    const contents = [
      // HERO SECTION - Main banner with background video
      {
        section: "hero",
        title: "Conexión Rural 360",
        subtitle: "Educating in Context",
        description: "A research initiative to strengthen education by creating a hybrid educational platform with territorialized content.",
        buttonText: "Learn more",
        buttonLink: "/proyecto",
        isVisible: true,
        order: 1,
      },

      // ABOUT SECTION - About the Project
      {
        section: "about",
        title: "About the Project",
        subtitle: "Conexión Rural 360: Educating in Context",
        description: "This is a research project developed since February 2025 that, through the strategy of Children's Social Cartography, mapped the interests, themes, and needs of children from two rural educational institutions. Based on these findings, contextualized educational content was designed and produced from a rural perspective, integrated into a hybrid MOOC-type platform that promotes access to learning from and for the territories.",
        content: "To determine the impact of the implementation of this educational platform on the strengthening of digital skills in rural communities and on the development of significant learning around the Culture of Peace, Citizenship Construction, Languages, and Computational Thinking.",
        buttonText: "General Objective",
        isVisible: true,
        order: 2,
      },

      // TEAM SECTION - Team
      {
        section: "team",
        title: "Who are we?",
        subtitle: "We are a group of multidisciplinary professionals who believe in education as a driver of social change.",
        description: "Multidisciplinary research team",
        isVisible: true,
        order: 3,
      },

      // CONTACT SECTION - Footer
      {
        section: "contact",
        title: "Contact",
        subtitle: "Teresila Barona Villamizar",
        description: "Compensar University",
        content: "ltbarona@ucompensar.edu.co",
        isVisible: true,
        order: 4,
      },
    ];

    console.log(`📊 Inserting ${contents.length} editable sections...`);

    for (const content of contents) {
      await db.insert(pageContent).values(content);
      console.log(`   ✓ Section "${content.section}" created`);
    }

    console.log("\n✅ Home page content created successfully");
    console.log(`   Total editable sections: ${contents.length}`);
    console.log("\n📝 Now you can edit these sections from http://localhost:5000/content");
    console.log("\n🎯 Available sections:");
    console.log("   • hero     → Main banner (title, subtitle, description)");
    console.log("   • about    → About the Project (description and objective)");
    console.log("   • team     → Team title and description");
    console.log("   • contact  → Contact information (footer)");
    console.log("\n💡 To edit:");
    console.log("   1. Go to http://localhost:5000/content");
    console.log("   2. Login: admin / admin123");
    console.log("   3. Find the section and edit");
    console.log("   4. Refresh http://localhost:5000 to see changes");

  } catch (error) {
    console.error("❌ Error generating content:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedContent();
