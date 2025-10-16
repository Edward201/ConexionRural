/**
 * Script para generar datos de demo para analytics
 * Uso: tsx server/seed-analytics.ts
 */

import "dotenv/config";
import { db } from "./db";
import { analytics } from "@shared/schema";

const sources = ["organic", "social", "direct", "referral"];
const mediums = ["google", "facebook", "twitter", "linkedin", "instagram", null];
const devices = ["desktop", "mobile", "tablet"];
const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
const oss = ["Windows", "Mac OS", "Android", "iOS", "Linux"];
const pages = [
  { url: "/", title: "Inicio" },
  { url: "/about", title: "Acerca de" },
  { url: "/services", title: "Servicios" },
  { url: "/contact", title: "Contacto" },
  { url: "/blog", title: "Blog" },
  { url: "/products", title: "Productos" },
];
const conversionTypes = ["registration", "subscription", "contact", "download"];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function seedAnalytics() {
  console.log("🌱 Generando datos de demo para analytics...");

  try {
    const events = [];
    const now = new Date();

    // Generar eventos de los últimos 30 días
    for (let day = 30; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);

      // Generar entre 20 y 100 eventos por día
      const eventsPerDay = randomInt(20, 100);

      for (let i = 0; i < eventsPerDay; i++) {
        const visitDate = new Date(date);
        visitDate.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));

        const page = randomItem(pages);
        const source = randomItem(sources);
        const medium = source === "direct" ? null : randomItem(mediums);
        const deviceType = randomItem(devices);
        const isNewUser = Math.random() > 0.6; // 40% usuarios recurrentes
        const bounced = Math.random() > 0.65; // 35% tasa de rebote
        const converted = !bounced && Math.random() > 0.92; // ~8% tasa de conversión

        events.push({
          pageUrl: page.url,
          pageTitle: page.title,
          referrer: source === "direct" ? null : `https://${medium || "google"}.com`,
          source,
          medium,
          campaign: Math.random() > 0.8 ? "summer_campaign" : null,
          sessionId: generateSessionId(),
          isNewUser,
          deviceType,
          browser: randomItem(browsers),
          os: randomItem(oss),
          screenResolution: deviceType === "mobile" ? "375x667" : "1920x1080",
          timeOnPage: bounced ? randomInt(5, 30) : randomInt(60, 300),
          bounced,
          converted,
          conversionType: converted ? randomItem(conversionTypes) : null,
          conversionValue: converted ? randomInt(10, 500) : null,
          country: "Colombia",
          city: randomItem(["Bogotá", "Medellín", "Cali", "Barranquilla"]),
          visitedAt: visitDate,
        });
      }
    }

    // Insertar en batch
    console.log(`📊 Insertando ${events.length} eventos de analytics...`);
    
    for (let i = 0; i < events.length; i += 100) {
      const batch = events.slice(i, i + 100);
      await db.insert(analytics).values(batch);
      console.log(`   Insertados ${Math.min(i + 100, events.length)}/${events.length} eventos`);
    }

    console.log("\n✅ Datos de demo generados exitosamente");
    console.log(`   Total eventos: ${events.length}`);
    console.log(`   Período: últimos 30 días`);
    console.log(`   Páginas: ${pages.length}`);
    console.log(`   Fuentes: ${sources.length}`);
    console.log("\n🎉 Ahora puedes ver los datos en /analytics");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error al generar datos:", error.message);
    process.exit(1);
  }
}

seedAnalytics();

