import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de usuarios con roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'admin' o 'user'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema para insertar usuario (registro)
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres").max(50),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["admin", "user"]).optional(),
}).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

// Schema para login
export const loginSchema = z.object({
  username: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

// Schema para seleccionar usuario (sin password)
export const selectUserSchema = createSelectSchema(users).omit({
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, "password">;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Tabla de métricas de analytics
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  // Datos de la visita
  pageUrl: text("page_url").notNull(),
  pageTitle: text("page_title"),
  referrer: text("referrer"),
  // Fuente de tráfico
  source: text("source").notNull(), // organic, social, direct, referral
  medium: text("medium"), // google, facebook, twitter, etc.
  campaign: text("campaign"),
  // Datos del usuario
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  isNewUser: boolean("is_new_user").notNull().default(true),
  // Datos del dispositivo
  deviceType: text("device_type").notNull(), // mobile, desktop, tablet
  browser: text("browser"),
  os: text("os"),
  screenResolution: text("screen_resolution"),
  // Datos de la sesión
  timeOnPage: integer("time_on_page").default(0), // segundos
  bounced: boolean("bounced").default(false),
  // Conversiones
  converted: boolean("converted").default(false),
  conversionType: text("conversion_type"), // registration, subscription, contact, etc.
  conversionValue: integer("conversion_value"), // valor monetario opcional
  // Geolocalización
  country: text("country"),
  city: text("city"),
  // Timestamps
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  visitedAt: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Tabla de contenido de la página principal (CMS)
export const pageContent = pgTable("page_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().unique(), // hero, about, services, features, etc.
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  content: text("content"), // JSON o texto largo
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  isVisible: boolean("is_visible").notNull().default(true),
  order: integer("order").default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertPageContentSchema = createInsertSchema(pageContent, {
  section: z.string().min(1, "La sección es requerida"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
}).omit({
  id: true,
  updatedAt: true,
});

export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContent.$inferSelect;
