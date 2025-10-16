import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import type { Express } from "express";
import session from "express-session";
import type { SafeUser } from "@shared/schema";

/**
 * Sets up authentication using Passport.
 * @param {Express} app - The Express application.
 */
export function setupAuth(app: Express) {
  // Configure session
  const sessionSecret = process.env.SESSION_SECRET || "default-secret-change-in-production";
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        if (!user.isActive) {
          return done(null, false, { message: "Inactive user" });
        }

        const isValidPassword = await storage.verifyPassword(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        // Do not send the password
        const { password: _, ...safeUser } = user;
        return done(null, safeUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user (save to session)
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as SafeUser).id);
  });

  // Deserialize user (retrieve from session)
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

/**
 * Middleware to protect routes.
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {any} next - The next middleware function.
 */
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

/**
 * Middleware to check if the user is an admin.
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {any} next - The next middleware function.
 */
export function isAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied. Only administrators" });
}

