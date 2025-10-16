import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import type { Express } from "express";
import session from "express-session";
import type { SafeUser } from "@shared/schema";

// Configuración de Passport
export function setupAuth(app: Express) {
  // Configurar sesión
  const sessionSecret = process.env.SESSION_SECRET || "default-secret-change-in-production";
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Estrategia Local de Passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "Usuario o contraseña incorrectos" });
        }

        if (!user.isActive) {
          return done(null, false, { message: "Usuario inactivo" });
        }

        const isValidPassword = await storage.verifyPassword(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "Usuario o contraseña incorrectos" });
        }

        // No enviar la contraseña
        const { password: _, ...safeUser } = user;
        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serializar usuario (guardar en sesión)
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as SafeUser).id);
  });

  // Deserializar usuario (recuperar de sesión)
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      const { password: _, ...safeUser } = user;
      done(null, safeUser);
    } catch (error) {
      done(error);
    }
  });
}

// Middleware para proteger rutas
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autenticado" });
}

// Middleware para verificar si es admin
export function isAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Acceso denegado. Solo administradores" });
}

