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
  videoUrl: text("video_url"), // Mantener por compatibilidad (no se usa actualmente)
  backgroundType: text("background_type").default("gradient"), // "gradient" o "image"
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  button2Text: text("button2_text"), // Segundo botón
  button2Link: text("button2_link"), // Link del segundo botón
  // Cards de estadísticas (3 cards en el hero)
  card1Number: integer("card1_number"),
  card1Label: text("card1_label"),
  card1Description: text("card1_description"),
  card2Number: integer("card2_number"),
  card2Label: text("card2_label"),
  card2Description: text("card2_description"),
  card3Number: integer("card3_number"),
  card3Label: text("card3_label"),
  card3Description: text("card3_description"),
  // Instituciones educativas (2 cards)
  inst1Title: text("inst1_title"),
  inst1Description: text("inst1_description"),
  inst1Link: text("inst1_link"),
  inst1Image: text("inst1_image"),
  inst2Title: text("inst2_title"),
  inst2Description: text("inst2_description"),
  inst2Link: text("inst2_link"),
  inst2Image: text("inst2_image"),
  // About section - Features (4 características)
  feature1Text: text("feature1_text"),
  feature2Text: text("feature2_text"),
  feature3Text: text("feature3_text"),
  feature4Text: text("feature4_text"),
  // Team section - Investigador Principal
  leadName: text("lead_name"),
  leadRole: text("lead_role"),
  leadBio: text("lead_bio"),
  leadEmail: text("lead_email"),
  leadPhoto: text("lead_photo"),
  // Team section - 3 Cards secundarias
  teamCard1Title: text("team_card1_title"),
  teamCard1Description: text("team_card1_description"),
  teamCard2Title: text("team_card2_title"),
  teamCard2Description: text("team_card2_description"),
  teamCard3Title: text("team_card3_title"),
  teamCard3Description: text("team_card3_description"),
  // Phases section - Fase 1 (CONECTAR)
  phase1Number: integer("phase1_number"),
  phase1Title: text("phase1_title"),
  phase1Description: text("phase1_description"),
  phase1Sub1Title: text("phase1_sub1_title"),
  phase1Sub1Description: text("phase1_sub1_description"),
  phase1Sub2Title: text("phase1_sub2_title"),
  phase1Sub2Description: text("phase1_sub2_description"),
  // Phases section - Fase 2 (CONSTRUIR)
  phase2Number: integer("phase2_number"),
  phase2Title: text("phase2_title"),
  phase2Description: text("phase2_description"),
  phase2Sub1Title: text("phase2_sub1_title"),
  phase2Sub1Description: text("phase2_sub1_description"),
  phase2Sub2Title: text("phase2_sub2_title"),
  phase2Sub2Description: text("phase2_sub2_description"),
  phase2Sub3Title: text("phase2_sub3_title"),
  phase2Box1Title: text("phase2_box1_title"),
  phase2Box1Items: text("phase2_box1_items"),
  phase2Box2Title: text("phase2_box2_title"),
  phase2Box2Items: text("phase2_box2_items"),
  // Phases section - Fase 3 (MAPEO)
  phase3Number: integer("phase3_number"),
  phase3Title: text("phase3_title"),
  phase3Description: text("phase3_description"),
  phase3Sub1Title: text("phase3_sub1_title"),
  phase3Sub1Description: text("phase3_sub1_description"),
  phase3Sub2Title: text("phase3_sub2_title"),
  phase3Sub2Description: text("phase3_sub2_description"),
  phase3BoxTitle: text("phase3_box_title"),
  phase3BoxItems: text("phase3_box_items"),
  // Footer section (contact)
  footerTitle: text("footer_title"),
  footerDescription: text("footer_description"),
  footerInstitTitle: text("footer_instit_title"),
  footerInstit1: text("footer_instit1"),
  footerInstit2: text("footer_instit2"),
  footerInstit3: text("footer_instit3"),
  footerCopyright: text("footer_copyright"),
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
