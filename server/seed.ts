/**
 * Database initialization script
 * Creates a default administrator user
 * 
 * Usage: tsx server/seed.ts
 */

import "dotenv/config";
import { storage } from "./storage";

/**
 * Seeds the database with a default administrator user.
 */
async function seed() {
  console.log("🌱 Initializing database seed...");

  try {
    // Check if an admin user already exists
    const existingAdmin = await storage.getUserByUsername("admin");

    if (existingAdmin) {
      console.log("✅ Admin user already exists. No seed required.");
      return;
    }

    // Create a default administrator user
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@conexionrural.com",
      password: "admin123", // CHANGE IN PRODUCTION
      role: "admin",
    });

    console.log("✅ Administrator user created successfully:");
    console.log("   User: admin");
    console.log("   Email: admin@conexionrural.com");
    console.log("   Password: admin123");
    console.log("   ⚠️  IMPORTANT: Change this password after the first login");

    // Create a test user
    const testUser = await storage.createUser({
      username: "test_user",
      email: "user@test.com",
      password: "test123",
      role: "user",
    });

    console.log("\n✅ Test user created:");
    console.log("   User: test_user");
    console.log("   Email: user@test.com");
    console.log("   Password: test123");

    console.log("\n🎉 Seed completed successfully");
  } catch (error: any) {
    console.error("❌ Error executing seed:", error.message);
    process.exit(1);
  }
}

seed();

