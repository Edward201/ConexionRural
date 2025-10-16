/**
 * Script to generate demo data for analytics
 * Usage: tsx server/seed-analytics.ts
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
  { url: "/", title: "Home" },
  { url: "/about", title: "About" },
  { url: "/services", title: "Services" },
  { url: "/contact", title: "Contact" },
  { url: "/blog", title: "Blog" },
  { url: "/products", title: "Products" },
];
const conversionTypes = ["registration", "subscription", "contact", "download"];

/**
 * Returns a random item from an array.
 * @param {T[]} array - The array to get a random item from.
 * @returns {T} A random item from the array.
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a random integer between two values.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between the two values.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random session ID.
 * @returns {string} A random session ID.
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Seeds the database with analytics data.
 */
async function seedAnalytics() {
  console.log("🌱 Generating demo data for analytics...");

  try {
    const events = [];
    const now = new Date();

    // Generate events for the last 30 days
    for (let day = 30; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);

      // Generate between 20 and 100 events per day
      const eventsPerDay = randomInt(20, 100);

      for (let i = 0; i < eventsPerDay; i++) {
        const visitDate = new Date(date);
        visitDate.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));

        const page = randomItem(pages);
        const source = randomItem(sources);
        const medium = source === "direct" ? null : randomItem(mediums);
        const deviceType = randomItem(devices);
        const isNewUser = Math.random() > 0.6; // 40% returning users
        const bounced = Math.random() > 0.65; // 35% bounce rate
        const converted = !bounced && Math.random() > 0.92; // ~8% conversion rate

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

    // Batch insert
    console.log(`📊 Inserting ${events.length} analytics events...`);
    
    for (let i = 0; i < events.length; i += 100) {
      const batch = events.slice(i, i + 100);
      await db.insert(analytics).values(batch);
      console.log(`   Inserted ${Math.min(i + 100, events.length)}/${events.length} events`);
    }

    console.log("\n✅ Demo data generated successfully");
    console.log(`   Total events: ${events.length}`);
    console.log(`   Period: last 30 days`);
    console.log(`   Pages: ${pages.length}`);
    console.log(`   Sources: ${sources.length}`);
    console.log("\n🎉 Now you can see the data in /analytics");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error generating data:", error.message);
    process.exit(1);
  }
}

seedAnalytics();

