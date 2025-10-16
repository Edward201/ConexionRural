/**
 * Script de inicialización de base de datos
 * Crea un usuario administrador por defecto
 * 
 * Uso: tsx server/seed.ts
 */

import "dotenv/config";
import { storage } from "./storage";

async function seed() {
  console.log("🌱 Iniciando seed de la base de datos...");

  try {
    // Verificar si ya existe un admin
    const existingAdmin = await storage.getUserByUsername("admin");

    if (existingAdmin) {
      console.log("✅ Usuario admin ya existe. No se requiere seed.");
      return;
    }

    // Crear usuario administrador por defecto
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@conexionrural.com",
      password: "admin123", // CAMBIAR EN PRODUCCIÓN
      role: "admin",
    });

    console.log("✅ Usuario administrador creado exitosamente:");
    console.log("   Usuario: admin");
    console.log("   Email: admin@conexionrural.com");
    console.log("   Contraseña: admin123");
    console.log("   ⚠️  IMPORTANTE: Cambia esta contraseña después del primer login");

    // Crear un usuario de prueba
    const testUser = await storage.createUser({
      username: "usuario_prueba",
      email: "usuario@test.com",
      password: "test123",
      role: "user",
    });

    console.log("\n✅ Usuario de prueba creado:");
    console.log("   Usuario: usuario_prueba");
    console.log("   Email: usuario@test.com");
    console.log("   Contraseña: test123");

    console.log("\n🎉 Seed completado exitosamente");
  } catch (error: any) {
    console.error("❌ Error al ejecutar seed:", error.message);
    process.exit(1);
  }
}

seed();

