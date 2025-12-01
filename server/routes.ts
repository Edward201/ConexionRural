import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isAuthenticatedUser } from "./auth";
import { insertUserSchema, loginSchema, insertAnalyticsSchema, analytics, insertPageContentSchema, pageContent, downloadableMaterials, insertDownloadableMaterialSchema, galleryItems, insertGalleryItemSchema, materialDownloads, insertMaterialDownloadSchema, videoViews, insertVideoViewSchema, teamCards, insertTeamCardSchema } from "@shared/schema";
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
    console.log("🚪 [LOGOUT] Cerrando sesión del usuario:", req.user?.username || "desconocido");
    
    req.logout((err) => {
      if (err) {
        console.error("❌ [LOGOUT] Error al cerrar sesión:", err);
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      
      // Destruir la sesión completamente
      req.session.destroy((err) => {
        if (err) {
          console.error("❌ [LOGOUT] Error al destruir sesión:", err);
        }
        
        // Limpiar la cookie de sesión
        res.clearCookie('connect.sid', { path: '/' });
        
        console.log("✅ [LOGOUT] Sesión cerrada y destruida exitosamente");
        res.json({ message: "Sesión cerrada exitosamente" });
      });
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

  // POST /api/dashboard/users - Crear nuevo usuario (solo admin)
  app.post("/api/dashboard/users", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      console.log("📥 [POST /api/dashboard/users] Datos recibidos:", req.body);
      
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        console.error("❌ [POST /api/dashboard/users] Validación fallida:", result.error);
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      console.log("✅ [POST /api/dashboard/users] Datos validados:", result.data);

      // Verificar si el usuario ya existe
      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        console.warn("⚠️ [POST /api/dashboard/users] Usuario ya existe:", result.data.username);
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      const existingEmail = await storage.getUserByEmail(result.data.email);
      if (existingEmail) {
        console.warn("⚠️ [POST /api/dashboard/users] Email ya registrado:", result.data.email);
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Crear usuario
      const newUser = await storage.createUser(result.data);
      console.log("✅ [POST /api/dashboard/users] Usuario creado exitosamente:", newUser.id);

      res.status(201).json({
        message: "Usuario creado exitosamente",
        user: newUser,
      });
    } catch (error) {
      console.error("💥 [POST /api/dashboard/users] Error:", error);
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

  // DELETE /api/dashboard/users/:id - Eliminar usuario (solo admin)
  app.delete("/api/dashboard/users/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      console.log("🗑️ [DELETE /api/dashboard/users/:id] Intentando eliminar usuario:", userId);
      
      // No permitir que un admin se elimine a sí mismo
      if (userId === (req.user as any).id) {
        console.warn("⚠️ [DELETE /api/dashboard/users/:id] Intento de auto-eliminación");
        return res.status(400).json({ message: "No puedes eliminar tu propia cuenta" });
      }

      const deleted = await storage.deleteUser(userId);

      if (!deleted) {
        console.warn("⚠️ [DELETE /api/dashboard/users/:id] Usuario no encontrado:", userId);
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      console.log("✅ [DELETE /api/dashboard/users/:id] Usuario eliminado:", deleted.id);
      res.json({ 
        message: "Usuario eliminado exitosamente", 
        user: deleted 
      });
    } catch (error) {
      console.error("💥 [DELETE /api/dashboard/users/:id] Error:", error);
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

  // GET /api/analytics/overview - Resumen general de analytics (Usuarios autenticados)
  app.get("/api/analytics/overview", isAuthenticatedUser, async (req, res, next) => {
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

  // GET /api/analytics/sources - Fuentes de tráfico (Usuarios autenticados)
  app.get("/api/analytics/sources", isAuthenticatedUser, async (req, res, next) => {
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

  // GET /api/analytics/pages - Páginas más visitadas (Usuarios autenticados)
  app.get("/api/analytics/pages", isAuthenticatedUser, async (req, res, next) => {
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

  // GET /api/analytics/devices - Dispositivos usados (Usuarios autenticados)
  app.get("/api/analytics/devices", isAuthenticatedUser, async (req, res, next) => {
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

  // GET /api/analytics/conversions - Conversiones por tipo (Usuarios autenticados)
  app.get("/api/analytics/conversions", isAuthenticatedUser, async (req, res, next) => {
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

  // GET /api/analytics/timeline - Visitas por día (Usuarios autenticados)
  app.get("/api/analytics/timeline", isAuthenticatedUser, async (req, res, next) => {
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

  // POST /api/analytics/track-download - Trackear descarga de material (Público)
  app.post("/api/analytics/track-download", async (req, res, next) => {
    try {
      const result = insertMaterialDownloadSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      await db.insert(materialDownloads).values(result.data);

      res.json({ message: "Descarga registrada exitosamente" });
    } catch (error) {
      console.error("Error tracking download:", error);
      next(error);
    }
  });

  // POST /api/analytics/track-video-view - Trackear reproducción de video (Público)
  app.post("/api/analytics/track-video-view", async (req, res, next) => {
    try {
      const result = insertVideoViewSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      await db.insert(videoViews).values(result.data);

      res.json({ message: "Reproducción registrada exitosamente" });
    } catch (error) {
      console.error("Error tracking video view:", error);
      next(error);
    }
  });

  // GET /api/analytics/material-downloads - Estadísticas de descargas de materiales (Usuarios autenticados)
  app.get("/api/analytics/material-downloads", isAuthenticatedUser, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      // Total de descargas
      const totalDownloads = await db
        .select({ count: count() })
        .from(materialDownloads)
        .where(gte(materialDownloads.downloadedAt, daysAgo));

      // Descargas por material
      const downloadsByMaterial = await db
        .select({
          materialId: materialDownloads.materialId,
          title: downloadableMaterials.title,
          fileType: downloadableMaterials.fileType,
          downloads: count(),
        })
        .from(materialDownloads)
        .leftJoin(downloadableMaterials, eq(materialDownloads.materialId, downloadableMaterials.id))
        .where(gte(materialDownloads.downloadedAt, daysAgo))
        .groupBy(materialDownloads.materialId, downloadableMaterials.title, downloadableMaterials.fileType)
        .orderBy(desc(count()));

      // Timeline de descargas por día
      const downloadsTimeline = await db
        .select({
          date: sql<string>`DATE(${materialDownloads.downloadedAt})`,
          downloads: count(),
        })
        .from(materialDownloads)
        .where(gte(materialDownloads.downloadedAt, daysAgo))
        .groupBy(sql`DATE(${materialDownloads.downloadedAt})`)
        .orderBy(sql`DATE(${materialDownloads.downloadedAt})`);

      res.json({ 
        totalDownloads: totalDownloads[0]?.count || 0,
        downloadsByMaterial,
        downloadsTimeline
      });
    } catch (error) {
      console.error("Error getting material downloads stats:", error);
      next(error);
    }
  });

  // GET /api/analytics/video-views - Estadísticas de reproducciones de videos (Usuarios autenticados)
  app.get("/api/analytics/video-views", isAuthenticatedUser, async (req, res, next) => {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));

      // Total de reproducciones
      const totalViews = await db
        .select({ count: count() })
        .from(videoViews)
        .where(gte(videoViews.viewedAt, daysAgo));

      // Reproducciones por video
      const viewsByVideo = await db
        .select({
          galleryItemId: videoViews.galleryItemId,
          title: galleryItems.title,
          views: count(),
        })
        .from(videoViews)
        .leftJoin(galleryItems, eq(videoViews.galleryItemId, galleryItems.id))
        .where(gte(videoViews.viewedAt, daysAgo))
        .groupBy(videoViews.galleryItemId, galleryItems.title)
        .orderBy(desc(count()));

      // Timeline de reproducciones por día
      const viewsTimeline = await db
        .select({
          date: sql<string>`DATE(${videoViews.viewedAt})`,
          views: count(),
        })
        .from(videoViews)
        .where(gte(videoViews.viewedAt, daysAgo))
        .groupBy(sql`DATE(${videoViews.viewedAt})`)
        .orderBy(sql`DATE(${videoViews.viewedAt})`);

      res.json({ 
        totalViews: totalViews[0]?.count || 0,
        viewsByVideo,
        viewsTimeline
      });
    } catch (error) {
      console.error("Error getting video views stats:", error);
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
      const { 
        section, 
        title, 
        subtitle, 
        description, 
        content, 
        imageUrl,
        videoUrl,
        backgroundType,
        buttonText, 
        buttonLink,
        button2Text,
        button2Link,
        card1Number,
        card1Label,
        card1Description,
        card2Number,
        card2Label,
        card2Description,
        card3Number,
        card3Label,
        card3Description,
        inst1Title,
        inst1Description,
        inst1Link,
        inst1Image,
        inst2Title,
        inst2Description,
        inst2Link,
        inst2Image,
        feature1Text,
        feature2Text,
        feature3Text,
        feature4Text,
        leadName,
        leadRole,
        leadBio,
        leadEmail,
        leadPhoto,
        teamCard1Title,
        teamCard1Description,
        teamCard2Title,
        teamCard2Description,
        teamCard3Title,
        teamCard3Description,
        phase1Number,
        phase1Title,
        phase1Description,
        phase1Sub1Title,
        phase1Sub1Description,
        phase1Sub2Title,
        phase1Sub2Description,
        phase2Number,
        phase2Title,
        phase2Description,
        phase2Sub1Title,
        phase2Sub1Description,
        phase2Sub2Title,
        phase2Sub2Description,
        phase2Sub3Title,
        phase2Box1Title,
        phase2Box1Items,
        phase2Box2Title,
        phase2Box2Items,
        phase3Number,
        phase3Title,
        phase3Description,
        phase3Sub1Title,
        phase3Sub1Description,
        phase3Sub2Title,
        phase3Sub2Description,
        phase3BoxTitle,
        phase3BoxItems,
        footerTitle,
        footerDescription,
        footerInstitTitle,
        footerInstit1,
        footerInstit2,
        footerInstit3,
        footerCopyright,
        isVisible, 
        order 
      } = req.body;

      const [updated] = await db
        .update(pageContent)
        .set({
          section,
          title,
          subtitle,
          description,
          content,
          imageUrl,
          videoUrl,
          backgroundType,
          buttonText,
          buttonLink,
          button2Text,
          button2Link,
          card1Number,
          card1Label,
          card1Description,
          card2Number,
          card2Label,
          card2Description,
          card3Number,
          card3Label,
          card3Description,
          inst1Title,
          inst1Description,
          inst1Link,
          inst1Image,
          inst2Title,
          inst2Description,
          inst2Link,
          inst2Image,
          feature1Text,
          feature2Text,
          feature3Text,
          feature4Text,
          leadName,
          leadRole,
          leadBio,
          leadEmail,
          leadPhoto,
          teamCard1Title,
          teamCard1Description,
          teamCard2Title,
          teamCard2Description,
          teamCard3Title,
          teamCard3Description,
          phase1Number,
          phase1Title,
          phase1Description,
          phase1Sub1Title,
          phase1Sub1Description,
          phase1Sub2Title,
          phase1Sub2Description,
          phase2Number,
          phase2Title,
          phase2Description,
          phase2Sub1Title,
          phase2Sub1Description,
          phase2Sub2Title,
          phase2Sub2Description,
          phase2Sub3Title,
          phase2Box1Title,
          phase2Box1Items,
          phase2Box2Title,
          phase2Box2Items,
          phase3Number,
          phase3Title,
          phase3Description,
          phase3Sub1Title,
          phase3Sub1Description,
          phase3Sub2Title,
          phase3Sub2Description,
          phase3BoxTitle,
          phase3BoxItems,
          footerTitle,
          footerDescription,
          footerInstitTitle,
          footerInstit1,
          footerInstit2,
          footerInstit3,
          footerCopyright,
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

  // ==================== RUTAS DE MATERIALES DESCARGABLES ====================

  // GET /api/materials - Obtener materiales activos (público)
  app.get("/api/materials", async (req, res, next) => {
    try {
      const materials = await db
        .select()
        .from(downloadableMaterials)
        .where(eq(downloadableMaterials.isActive, true))
        .orderBy(asc(downloadableMaterials.order));

      res.json({ materials });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/cms/materials - Obtener todos los materiales (Admin)
  app.get("/api/cms/materials", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const materials = await db
        .select()
        .from(downloadableMaterials)
        .orderBy(asc(downloadableMaterials.order));

      res.json({ materials });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/cms/materials - Crear nuevo material (Admin)
  app.post("/api/cms/materials", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const result = insertDownloadableMaterialSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      const [newMaterial] = await db
        .insert(downloadableMaterials)
        .values({
          ...result.data,
          updatedBy: (req.user as any).id,
        })
        .returning();

      res.status(201).json({
        message: "Material creado exitosamente",
        material: newMaterial,
      });
    } catch (error) {
      next(error);
    }
  });

  // PUT /api/cms/materials/:id - Actualizar material (Admin)
  app.put("/api/cms/materials/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, fileType, fileSize, fileUrl, isActive, order } = req.body;

      const [updated] = await db
        .update(downloadableMaterials)
        .set({
          title,
          description,
          fileType,
          fileSize,
          fileUrl,
          isActive,
          order,
          updatedAt: new Date(),
          updatedBy: (req.user as any).id,
        })
        .where(eq(downloadableMaterials.id, parseInt(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Material no encontrado" });
      }

      res.json({
        message: "Material actualizado exitosamente",
        material: updated,
      });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/cms/materials/:id - Eliminar material (Admin)
  app.delete("/api/cms/materials/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;

      const [deleted] = await db
        .delete(downloadableMaterials)
        .where(eq(downloadableMaterials.id, parseInt(id)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ message: "Material no encontrado" });
      }

      res.json({
        message: "Material eliminado exitosamente",
        material: deleted,
      });
    } catch (error) {
      next(error);
    }
  });

  // ==================== RUTAS DE GALERÍA INTERACTIVA ====================

  // GET /api/gallery - Obtener items de galería activos (público)
  app.get("/api/gallery", async (req, res, next) => {
    try {
      const items = await db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.isActive, true))
        .orderBy(asc(galleryItems.order));

      res.json({ items });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/cms/gallery - Obtener todos los items de galería (Admin)
  app.get("/api/cms/gallery", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const items = await db
        .select()
        .from(galleryItems)
        .orderBy(asc(galleryItems.order));

      res.json({ items });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/cms/gallery - Crear nuevo item de galería (Admin)
  app.post("/api/cms/gallery", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const result = insertGalleryItemSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      const [newItem] = await db
        .insert(galleryItems)
        .values({
          ...result.data,
          updatedBy: (req.user as any).id,
        })
        .returning();

      res.status(201).json({
        message: "Item de galería creado exitosamente",
        item: newItem,
      });
    } catch (error) {
      next(error);
    }
  });

  // PUT /api/cms/gallery/:id - Actualizar item de galería (Admin)
  app.put("/api/cms/gallery/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, imageUrl, videoUrl, isActive, order } = req.body;

      const [updated] = await db
        .update(galleryItems)
        .set({
          title,
          description,
          imageUrl,
          videoUrl: videoUrl || null,
          isActive,
          order,
          updatedAt: new Date(),
          updatedBy: (req.user as any).id,
        })
        .where(eq(galleryItems.id, parseInt(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Item de galería no encontrado" });
      }

      res.json({
        message: "Item de galería actualizado exitosamente",
        item: updated,
      });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/cms/gallery/:id - Eliminar item de galería (Admin)
  app.delete("/api/cms/gallery/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;

      const [deleted] = await db
        .delete(galleryItems)
        .where(eq(galleryItems.id, parseInt(id)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ message: "Item de galería no encontrado" });
      }

      res.json({
        message: "Item de galería eliminado exitosamente",
        item: deleted,
      });
    } catch (error) {
      next(error);
    }
  });

  // ==================== RUTAS DE CARDS DEL EQUIPO ====================

  // GET /api/cms/team-cards - Obtener todas las cards del equipo (público - solo activas)
  app.get("/api/cms/team-cards", async (req, res, next) => {
    try {
      const cards = await db
        .select()
        .from(teamCards)
        .where(eq(teamCards.isActive, true))
        .orderBy(asc(teamCards.order));

      res.json({ cards });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/cms/team-cards/admin - Obtener todas las cards del equipo (Admin - incluye inactivas)
  app.get("/api/cms/team-cards/admin", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const cards = await db
        .select()
        .from(teamCards)
        .orderBy(asc(teamCards.order));

      res.json({ cards });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/cms/team-cards - Crear nueva card del equipo (Admin)
  app.post("/api/cms/team-cards", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      console.log("📝 [TEAM-CARDS] Intentando crear card:", req.body);
      
      const result = insertTeamCardSchema.safeParse(req.body);
      
      if (!result.success) {
        console.error("❌ [TEAM-CARDS] Error de validación:", result.error);
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: fromError(result.error).toString() 
        });
      }

      // Convertir strings vacíos a null para campos opcionales
      const dataToInsert = {
        title: result.data.title,
        description: result.data.description && result.data.description.trim() !== "" ? result.data.description : null,
        imageUrl: result.data.imageUrl && result.data.imageUrl.trim() !== "" ? result.data.imageUrl : null,
        order: result.data.order ?? 0,
        isActive: result.data.isActive ?? true,
        updatedBy: (req.user as any).id,
      };

      console.log("💾 [TEAM-CARDS] Datos a insertar:", dataToInsert);

      const [newCard] = await db
        .insert(teamCards)
        .values(dataToInsert)
        .returning();

      console.log("✅ [TEAM-CARDS] Card creada exitosamente:", newCard);

      res.status(201).json({
        message: "Card del equipo creada exitosamente",
        card: newCard,
      });
    } catch (error: any) {
      console.error("❌ [TEAM-CARDS] Error creando card del equipo:", error);
      console.error("❌ [TEAM-CARDS] Stack:", error.stack);
      
      // Asegurar que siempre devolvemos JSON
      if (!res.headersSent) {
        return res.status(500).json({ 
          message: "Error al crear card del equipo",
          error: error.message || "Error desconocido"
        });
      }
      next(error);
    }
  });

  // PUT /api/cms/team-cards/:id - Actualizar card del equipo (Admin)
  app.put("/api/cms/team-cards/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, imageUrl, isActive, order } = req.body;

      // Convertir strings vacíos a null para campos opcionales
      const updateData = {
        title,
        description: description && description.trim() !== "" ? description : null,
        imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
        isActive,
        order: order || 0,
        updatedAt: new Date(),
        updatedBy: (req.user as any).id,
      };

      const [updated] = await db
        .update(teamCards)
        .set(updateData)
        .where(eq(teamCards.id, parseInt(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Card del equipo no encontrada" });
      }

      res.json({
        message: "Card del equipo actualizada exitosamente",
        card: updated,
      });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/cms/team-cards/:id - Eliminar card del equipo (Admin)
  app.delete("/api/cms/team-cards/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;

      const [deleted] = await db
        .delete(teamCards)
        .where(eq(teamCards.id, parseInt(id)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ message: "Card del equipo no encontrada" });
      }

      res.json({
        message: "Card del equipo eliminada exitosamente",
        card: deleted,
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
