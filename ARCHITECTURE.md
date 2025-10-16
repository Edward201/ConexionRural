# 🏗️ Arquitectura del Sistema de Autenticación

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (React)                       │
├─────────────────────────────────────────────────────────────┤
│  Pages:                                                      │
│  • /login          → LoginPage                              │
│  • /register       → RegisterPage                           │
│  • /dashboard      → DashboardPage (Admin only)            │
│  • /              → HomePage                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP Requests
                  │ (fetch API)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVIDOR (Express.js)                       │
├─────────────────────────────────────────────────────────────┤
│  Middleware:                                                 │
│  • express-session     → Manejo de sesiones                 │
│  • passport            → Autenticación                       │
│  • express.json()      → Parser de JSON                     │
│                                                              │
│  Routes (server/routes.ts):                                 │
│  POST   /api/auth/register   → Registrar usuario           │
│  POST   /api/auth/login      → Iniciar sesión              │
│  POST   /api/auth/logout     → Cerrar sesión               │
│  GET    /api/auth/me         → Usuario actual              │
│  GET    /api/dashboard/stats → Estadísticas (Admin)        │
│  GET    /api/dashboard/users → Listar usuarios (Admin)     │
│  PUT    /api/dashboard/users/:id → Actualizar usuario (Admin)│
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ SQL Queries
                  │ (Drizzle ORM)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DATOS (PostgreSQL)                  │
├─────────────────────────────────────────────────────────────┤
│  Tabla: users                                               │
│  ┌─────────┬──────────┬────────┬──────────┬──────────┐    │
│  │ id (PK) │ username │ email  │ password │ role     │    │
│  │ (serial)│ (unique) │(unique)│ (hashed) │ (text)   │    │
│  ├─────────┼──────────┼────────┼──────────┼──────────┤    │
│  │ 1       │ admin    │admin@..│ $2b$...  │ admin    │    │
│  │ 2       │ user1    │user1@..│ $2b$...  │ user     │    │
│  └─────────┴──────────┴────────┴──────────┴──────────┘    │
│                                                              │
│  Campos adicionales:                                         │
│  • is_active (boolean)                                      │
│  • created_at (timestamp)                                   │
│  • updated_at (timestamp)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Archivos

```
ConexionRural/
│
├── 📁 server/                    # Backend
│   ├── index.ts                  # Punto de entrada
│   ├── routes.ts                 # ✨ Rutas API + Auth
│   ├── auth.ts                   # ✨ Configuración Passport
│   ├── storage.ts                # ✨ Capa de acceso a datos
│   ├── db.ts                     # ✨ Cliente PostgreSQL
│   ├── seed.ts                   # ✨ Script de inicialización
│   └── vite.ts                   # Servidor Vite
│
├── 📁 client/                    # Frontend
│   ├── src/
│   │   ├── App.tsx               # ✨ Rutas actualizadas
│   │   ├── pages/
│   │   │   ├── home.tsx          # Página principal
│   │   │   ├── login.tsx         # ✨ Login
│   │   │   ├── register.tsx      # ✨ Registro
│   │   │   └── dashboard.tsx     # ✨ Dashboard Admin
│   │   ├── components/ui/        # 40+ componentes Radix UI
│   │   └── hooks/                # Custom hooks
│   └── index.html
│
├── 📁 shared/                    # Código compartido
│   └── schema.ts                 # ✨ Schema DB + Validaciones Zod
│
├── 📁 attached_assets/           # Assets estáticos
│
├── 📄 .env                       # ✨ Variables de entorno
├── 📄 env.local.txt              # ✨ Plantilla .env
├── 📄 database-setup.sql         # ✨ Script SQL inicial
├── 📄 SETUP-AUTH.md              # ✨ Guía detallada
├── 📄 QUICK-START.md             # ✨ Inicio rápido
├── 📄 ARCHITECTURE.md            # ✨ Este archivo
│
├── package.json                  # ✨ Scripts actualizados
├── drizzle.config.ts             # Configuración Drizzle ORM
├── vite.config.ts                # ✨ Configuración Vite (Node 18)
└── tsconfig.json                 # Configuración TypeScript

✨ = Archivo nuevo o modificado
```

---

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario

```
Usuario completa formulario
         ↓
POST /api/auth/register
         ↓
Validación con Zod (insertUserSchema)
         ↓
Verificar username/email únicos
         ↓
Hash password con bcrypt (10 rounds)
         ↓
Insertar en DB (storage.createUser)
         ↓
Retornar usuario SIN password
         ↓
Redirigir a /login
```

### 2. Inicio de Sesión

```
Usuario ingresa credenciales
         ↓
POST /api/auth/login
         ↓
Validación con Zod (loginSchema)
         ↓
Passport Local Strategy
         ↓
Buscar usuario por username
         ↓
Verificar password con bcrypt.compare
         ↓
Verificar que usuario esté activo
         ↓
Crear sesión (passport.serializeUser)
         ↓
Guardar en cookie (express-session)
         ↓
Redirigir según rol:
  • admin  → /dashboard
  • user   → /
```

### 3. Protección de Rutas

```
Request a /api/dashboard/*
         ↓
Middleware: isAuthenticated
  ↓ NO → 401 Unauthorized
  ↓ SÍ
         ↓
Middleware: isAdmin
  ↓ NO → 403 Forbidden
  ↓ SÍ
         ↓
Ejecutar controlador
         ↓
Retornar datos
```

---

## 🔧 Stack Tecnológico

### Backend
| Tecnología | Propósito |
|------------|-----------|
| **Express.js** | Servidor HTTP |
| **Passport.js** | Estrategia de autenticación |
| **express-session** | Manejo de sesiones |
| **bcryptjs** | Hash de contraseñas |
| **Drizzle ORM** | ORM para PostgreSQL |
| **Zod** | Validación de esquemas |
| **tsx** | Ejecutar TypeScript |

### Frontend
| Tecnología | Propósito |
|------------|-----------|
| **React 18** | Framework UI |
| **Radix UI** | Componentes accesibles |
| **TanStack Query** | Manejo de estado servidor |
| **React Hook Form** | Formularios |
| **Wouter** | Routing ligero |
| **Tailwind CSS** | Estilos |

### Base de Datos
| Tecnología | Propósito |
|------------|-----------|
| **PostgreSQL** | Base de datos relacional |
| **Neon Serverless** | Cliente PostgreSQL HTTP |

---

## 🛡️ Seguridad Implementada

✅ **Passwords hasheadas** - bcrypt con 10 rounds  
✅ **Sesiones HTTP-only** - Cookies no accesibles por JS  
✅ **Validación de entrada** - Zod en frontend y backend  
✅ **Protección CSRF** - express-session con secret  
✅ **Roles y permisos** - Middleware isAdmin/isAuthenticated  
✅ **SQL Injection protegido** - Drizzle ORM con prepared statements  
✅ **Usuarios únicos** - Constraints en username y email  
✅ **Estado de usuario** - Campo isActive para desactivar cuentas  

---

## 📈 Escalabilidad

### Próximas Mejoras Recomendadas

1. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 min
     max: 5 // 5 intentos
   });
   
   app.post('/api/auth/login', loginLimiter, ...);
   ```

2. **Tokens JWT** (para API stateless)
   ```typescript
   import jwt from 'jsonwebtoken';
   
   const token = jwt.sign({ userId }, SECRET);
   ```

3. **OAuth** (Google, GitHub)
   ```typescript
   import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
   ```

4. **2FA (Two-Factor Auth)**
   ```typescript
   import speakeasy from 'speakeasy';
   ```

5. **Redis para sesiones** (en producción)
   ```typescript
   import RedisStore from 'connect-redis';
   ```

6. **Refresh Tokens**
7. **Email de verificación**
8. **Recuperación de contraseña**
9. **Logs de auditoría**
10. **Encriptación de datos sensibles**

---

## 🧪 Testing (No implementado aún)

### Estructura Recomendada

```typescript
// server/__tests__/auth.test.ts
describe('Authentication', () => {
  test('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'test@test.com', password: '123456' });
    
    expect(res.status).toBe(201);
  });
  
  test('should login with valid credentials', async () => {
    // ...
  });
});
```

---

## 🚀 Deployment

### Variables de Entorno en Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
SESSION_SECRET=genera-uno-muy-seguro-aqui-con-crypto
PORT=5000
```

### Consideraciones

- ✅ Cambiar contraseña del admin
- ✅ Generar SESSION_SECRET aleatorio
- ✅ Configurar HTTPS
- ✅ Configurar CORS adecuadamente
- ✅ Usar PostgreSQL en servidor remoto
- ✅ Configurar backups de DB
- ✅ Logging con Winston o similar
- ✅ Monitoring con Sentry o similar

---

## 📊 Métricas y Monitoreo

### Endpoints para Monitoreo

```typescript
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Métricas básicas
app.get('/metrics', isAdmin, async (req, res) => {
  const stats = await storage.getAllUsers();
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    users: stats.length
  });
});
```

---

## 📚 Recursos

- [Express.js Docs](https://expressjs.com/)
- [Passport.js Guide](http://www.passportjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

**Última actualización:** Octubre 2025  
**Versión del sistema:** 1.0.0

