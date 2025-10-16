import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { insertUserSchema, loginSchema, insertAnalyticsSchema, analytics, insertPageContentSchema, pageContent } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { db } from "./db";
import { eq, sql, and, gte, desc, count, asc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticación
  setupAuth(app);

  // ==================== RUTAS DE AUTENTICACIÓN ====================

  // POST /api/auth/register - Registrar nuevo usuario
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      const existingEmail = await storage.getUserByEmail(result.data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Crear usuario
      const newUser = await storage.createUser(result.data);

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/auth/login - Iniciar sesión
  app.post("/api/auth/login", (req, res, next) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: fromError(result.error).toString(),
      });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ 
          message: info?.message || "Credenciales inválidas" 
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.json({
          message: "Inicio de sesión exitoso",
          user,
        });
      });
    })(req, res, next);
  });

  // POST /api/auth/logout - Cerrar sesión
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  // GET /api/auth/me - Obtener usuario actual
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });

  // ==================== RUTAS DEL DASHBOARD (Admin) ====================

  // GET /api/dashboard/users - Listar todos los usuarios (solo admin)
  app.get("/api/dashboard/users", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  });

  // PUT /api/dashboard/users/:id - Actualizar usuario (solo admin)
  app.put("/api/dashboard/users/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, role, isActive } = req.body;

      const updated = await storage.updateUser(userId, {
        username,
        email,
        role,
        isActive,
      });

      if (!updated) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({ 
        message: "Usuario actualizado exitosamente", 
        user: updated 
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/dashboard/stats - Estadísticas básicas (solo admin)
  app.get("/api/dashboard/stats", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        adminUsers: users.filter((u) => u.role === "admin").length,
        regularUsers: users.filter((u) => u.role === "user").length,
      };
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  });

  // ==================== RUTAS DE ANALYTICS ====================

  // POST /api/analytics/track - Registrar evento de analytics (público)
  app.post("/api/analytics/track", async (req, res, next) => {
    try {
      const result = insertAnalyticsSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      const [event] = await db.insert(analytics).values(result.data).returning();
      res.status(201).json({ success: true, event });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/analytics/overview - Resumen general de analytics (Admin)
  app.get("/api/analytics/overview", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { days = 30, source, deviceType, pageUrl } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      // Construir filtros dinámicamente
      const filters: any[] = [gte(analytics.visitedAt, daysAgo)];
      if (source && source !== "all") filters.push(eq(analytics.source, source as string));
      if (deviceType && deviceType !== "all") filters.push(eq(analytics.deviceType, deviceType as string));
      if (pageUrl) filters.push(eq(analytics.pageUrl, pageUrl as string));

      // Total de visitas
      const [totalVisits] = await db
        .select({ count: count() })
        .from(analytics)
        .where(and(...filters));

      // Usuarios nuevos vs recurrentes
      const [newUsers] = await db
        .select({ count: count() })
        .from(analytics)
        .where(and(...filters, eq(analytics.isNewUser, true)));

      const [returningUsers] = await db
        .select({ count: count() })
        .from(analytics)
        .where(and(...filters, eq(analytics.isNewUser, false)));

      // Tiempo promedio en página
      const [avgTime] = await db
        .select({ avg: sql<number>`AVG(${analytics.timeOnPage})` })
        .from(analytics)
        .where(and(...filters));

      // Tasa de rebote
      const [bouncedCount] = await db
        .select({ count: count() })
        .from(analytics)
        .where(and(...filters, eq(analytics.bounced, true)));

      const bounceRate = totalVisits.count > 0 
        ? ((bouncedCount.count / totalVisits.count) * 100).toFixed(2)
        : 0;

      // Conversiones
      const [conversions] = await db
        .select({ count: count() })
        .from(analytics)
        .where(and(...filters, eq(analytics.converted, true)));

      res.json({
        overview: {
          totalVisits: totalVisits.count,
          newUsers: newUsers.count,
          returningUsers: returningUsers.count,
          avgTimeOnPage: Math.round(avgTime.avg || 0),
          bounceRate: Number(bounceRate),
          conversions: conversions.count,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/analytics/sources - Fuentes de tráfico (Admin)
  app.get("/api/analytics/sources", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      const sources = await db
        .select({
          source: analytics.source,
          medium: analytics.medium,
          visits: count(),
        })
        .from(analytics)
        .where(gte(analytics.visitedAt, daysAgo))
        .groupBy(analytics.source, analytics.medium)
        .orderBy(desc(count()));

      res.json({ sources });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/analytics/pages - Páginas más visitadas (Admin)
  app.get("/api/analytics/pages", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      const pages = await db
        .select({
          pageUrl: analytics.pageUrl,
          pageTitle: analytics.pageTitle,
          visits: count(),
          avgTime: sql<number>`AVG(${analytics.timeOnPage})`,
        })
        .from(analytics)
        .where(gte(analytics.visitedAt, daysAgo))
        .groupBy(analytics.pageUrl, analytics.pageTitle)
        .orderBy(desc(count()))
        .limit(10);

      res.json({ pages });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/analytics/devices - Dispositivos usados (Admin)
  app.get("/api/analytics/devices", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      const devices = await db
        .select({
          deviceType: analytics.deviceType,
          browser: analytics.browser,
          os: analytics.os,
          visits: count(),
        })
        .from(analytics)
        .where(gte(analytics.visitedAt, daysAgo))
        .groupBy(analytics.deviceType, analytics.browser, analytics.os)
        .orderBy(desc(count()));

      res.json({ devices });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/analytics/conversions - Conversiones por tipo (Admin)
  app.get("/api/analytics/conversions", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      const conversions = await db
        .select({
          conversionType: analytics.conversionType,
          count: count(),
          totalValue: sql<number>`SUM(${analytics.conversionValue})`,
        })
        .from(analytics)
        .where(and(
          gte(analytics.visitedAt, daysAgo),
          eq(analytics.converted, true)
        ))
        .groupBy(analytics.conversionType);

      res.json({ conversions });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/analytics/timeline - Visitas por día (Admin)
  app.get("/api/analytics/timeline", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      const timeline = await db
        .select({
          date: sql<string>`DATE(${analytics.visitedAt})`,
          visits: count(),
          newUsers: sql<number>`SUM(CASE WHEN ${analytics.isNewUser} THEN 1 ELSE 0 END)`,
          conversions: sql<number>`SUM(CASE WHEN ${analytics.converted} THEN 1 ELSE 0 END)`,
        })
        .from(analytics)
        .where(gte(analytics.visitedAt, daysAgo))
        .groupBy(sql`DATE(${analytics.visitedAt})`)
        .orderBy(sql`DATE(${analytics.visitedAt})`);

      res.json({ timeline });
    } catch (error) {
      next(error);
    }
  });

  // ==================== RUTAS DE CMS (Gestión de Contenido) ====================

  // GET /api/content - Obtener todo el contenido (público)
  app.get("/api/content", async (req, res, next) => {
    try {
      const contents = await db
        .select()
        .from(pageContent)
        .where(eq(pageContent.isVisible, true))
        .orderBy(asc(pageContent.order));

      res.json({ contents });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/content/:section - Obtener contenido de una sección específica (público)
  app.get("/api/content/:section", async (req, res, next) => {
    try {
      const { section } = req.params;
      const [content] = await db
        .select()
        .from(pageContent)
        .where(and(
          eq(pageContent.section, section),
          eq(pageContent.isVisible, true)
        ));

      if (!content) {
        return res.status(404).json({ message: "Sección no encontrada" });
      }

      res.json({ content });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/cms/content - Obtener todo el contenido (Admin)
  app.get("/api/cms/content", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      console.log('🔍 [CMS] Obteniendo contenido...');
      const contents = await db
        .select()
        .from(pageContent)
        .orderBy(asc(pageContent.order));

      console.log(`✅ [CMS] Encontradas ${contents.length} secciones`);
      res.json({ contents });
    } catch (error) {
      console.error('❌ [CMS] Error:', error);
      next(error);
    }
  });

  // POST /api/cms/content - Crear nueva sección de contenido (Admin)
  app.post("/api/cms/content", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const result = insertPageContentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      const [newContent] = await db
        .insert(pageContent)
        .values({
          ...result.data,
          updatedBy: (req.user as any).id,
        })
        .returning();

      res.status(201).json({
        message: "Contenido creado exitosamente",
        content: newContent,
      });
    } catch (error) {
      next(error);
    }
  });

  // PUT /api/cms/content/:id - Actualizar contenido (Admin)
  app.put("/api/cms/content/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { section, title, subtitle, description, content, imageUrl, buttonText, buttonLink, isVisible, order } = req.body;

      const [updated] = await db
        .update(pageContent)
        .set({
          section,
          title,
          subtitle,
          description,
          content,
          imageUrl,
          buttonText,
          buttonLink,
          isVisible,
          order,
          updatedAt: new Date(),
          updatedBy: (req.user as any).id,
        })
        .where(eq(pageContent.id, parseInt(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Contenido no encontrado" });
      }

      res.json({
        message: "Contenido actualizado exitosamente",
        content: updated,
      });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/cms/content/:id - Eliminar contenido (Admin)
  app.delete("/api/cms/content/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;

      const [deleted] = await db
        .delete(pageContent)
        .where(eq(pageContent.id, parseInt(id)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ message: "Contenido no encontrado" });
      }

      res.json({
        message: "Contenido eliminado exitosamente",
        content: deleted,
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
