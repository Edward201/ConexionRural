import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for inserting a user (registration)
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters long").max(50),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "user"]).optional(),
}).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

// Schema for login
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schema for selecting a user (without password)
export const selectUserSchema = createSelectSchema(users).omit({
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, "password">;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Analytics metrics table
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  // Visit data
  pageUrl: text("page_url").notNull(),
  pageTitle: text("page_title"),
  referrer: text("referrer"),
  // Traffic source
  source: text("source").notNull(), // organic, social, direct, referral
  medium: text("medium"), // google, facebook, twitter, etc.
  campaign: text("campaign"),
  // User data
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  isNewUser: boolean("is_new_user").notNull().default(true),
  // Device data
  deviceType: text("device_type").notNull(), // mobile, desktop, tablet
  browser: text("browser"),
  os: text("os"),
  screenResolution: text("screen_resolution"),
  // Session data
  timeOnPage: integer("time_on_page").default(0), // seconds
  bounced: boolean("bounced").default(false),
  // Conversions
  converted: boolean("converted").default(false),
  conversionType: text("conversion_type"), // registration, subscription, contact, etc.
  conversionValue: integer("conversion_value"), // optional monetary value
  // Geolocation
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

// Main page content table (CMS)
export const pageContent = pgTable("page_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().unique(), // hero, about, services, features, etc.
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  content: text("content"), // JSON or long text
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  isVisible: boolean("is_visible").notNull().default(true),
  order: integer("order").default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertPageContentSchema = createInsertSchema(pageContent, {
  section: z.string().min(1, "Section is required"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
}).omit({
  id: true,
  updatedAt: true,
});

export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContent.$inferSelect;
