# 📘 Manual Técnico - Conexión Rural 360

**Versión**: 1.0  
**Fecha**: Enero 2025  
**Stack**: React + TypeScript + Express + PostgreSQL

---

## 📋 Tabla de Contenidos

1. [Descripción General](#1-descripción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Base de Datos](#4-base-de-datos)
5. [API Endpoints](#5-api-endpoints)
6. [Frontend](#6-frontend)
7. [Sistema de Autenticación](#7-sistema-de-autenticación)
8. [Sistemas CMS Implementados](#8-sistemas-cms-implementados)
9. [Configuración y Despliegue](#9-configuración-y-despliegue)
10. [Guía de Desarrollo](#10-guía-de-desarrollo)
11. [Mantenimiento](#11-mantenimiento)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Descripción General

### 1.1 Resumen del Proyecto

**Conexión Rural 360** es una plataforma web educativa que documenta y presenta un proyecto de investigación sobre educación rural en Colombia. La aplicación incluye:

- Landing page institucional con información del proyecto
- Sistema de autenticación y gestión de usuarios
- Dashboard administrativo
- Sistema de analytics avanzado
- CMS (Content Management System) para administrar contenido dinámico
- Gestión de materiales descargables
- Gestión de galería interactiva

### 1.2 Tecnologías Principales

**Frontend:**
- React 18
- TypeScript
- Wouter (routing)
- TanStack Query (data fetching)
- Shadcn UI (componentes)
- Tailwind CSS (estilos)
- Anime.js (animaciones)

**Backend:**
- Node.js
- Express
- TypeScript
- PostgreSQL (base de datos)
- Drizzle ORM
- Passport.js (autenticación)
- Express Session

**Herramientas de Desarrollo:**
- Vite (build tool)
- ESLint (linting)
- PostCSS (procesador CSS)

### 1.3 Características Principales

- ✅ Autenticación con roles (admin/user)
- ✅ Dashboard administrativo completo
- ✅ Sistema de analytics con métricas avanzadas
- ✅ CMS para gestión de contenido de la página principal
- ✅ Sistema de materiales descargables
- ✅ Galería interactiva con videos
- ✅ Animaciones avanzadas con anime.js
- ✅ Diseño responsive
- ✅ API RESTful completa

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Home       │  │  Dashboard   │  │   CMS Pages  │  │
│  │   Landing    │  │   Analytics  │  │   Materials  │  │
│  │              │  │              │  │   Gallery    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         TanStack Query (State Management)        │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP/REST
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Auth       │  │   CMS        │  │  Analytics   │  │
│  │   Routes     │  │   Routes     │  │   Routes     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Middleware (Auth, Session)             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Drizzle ORM                         │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   users      │  │ page_content │  │  analytics   │  │
│  │   sessions   │  │  materials   │  │  gallery     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

1. **Usuario → Frontend**: Interacción con la UI
2. **Frontend → Backend**: Peticiones HTTP (fetch API)
3. **Backend → Middleware**: Autenticación y validación
4. **Backend → Database**: Consultas SQL via Drizzle ORM
5. **Database → Backend**: Datos resultantes
6. **Backend → Frontend**: Respuesta JSON
7. **Frontend → Usuario**: Actualización de UI

### 2.3 Patrones de Diseño

- **MVC**: Separación de lógica en Modelo (DB), Vista (React), Controlador (Express)
- **RESTful API**: Endpoints semánticos con verbos HTTP
- **Component-Based**: UI dividida en componentes reutilizables
- **Server-Side Session**: Autenticación basada en sesiones
- **Query Client**: Cache de datos en el cliente con TanStack Query

---

## 3. Estructura de Directorios

```
ConexionRural/
│
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/        # Componentes UI reutilizables
│   │   │   └── ui/           # Componentes Shadcn UI
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── use-analytics.ts
│   │   │   ├── use-anime.ts
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/              # Utilidades y configuración
│   │   │   ├── analytics.ts
│   │   │   ├── animations.ts
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── pages/            # Páginas de la aplicación
│   │   │   ├── analytics-enhanced.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── content-management.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── gallery-management.tsx
│   │   │   ├── home.tsx
│   │   │   ├── login.tsx
│   │   │   ├── materials-management.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── register.tsx
│   │   ├── App.tsx           # Componente raíz y router
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Estilos globales
│   └── index.html            # HTML principal
│
├── server/                   # Backend (Express)
│   ├── auth.ts              # Configuración de autenticación
│   ├── db.ts                # Conexión a base de datos
│   ├── index.ts             # Entry point del servidor
│   ├── routes.ts            # Definición de todas las rutas
│   ├── seed.ts              # Seed de datos iniciales
│   ├── seed-analytics.ts    # Seed de analytics
│   ├── seed-content.ts      # Seed de contenido
│   ├── storage.ts           # Capa de abstracción de datos
│   └── vite.ts              # Integración con Vite
│
├── shared/                   # Código compartido
│   └── schema.ts            # Schemas de base de datos (Drizzle)
│
├── attached_assets/          # Assets del proyecto
│   └── [imágenes y archivos]
│
├── database-migration-*.sql  # Migraciones de base de datos
├── aplicar-migracion-*.js   # Scripts de migración
│
├── *.md                      # Documentación
│
├── drizzle.config.ts        # Configuración Drizzle ORM
├── vite.config.ts           # Configuración Vite
├── tsconfig.json            # Configuración TypeScript
├── tailwind.config.ts       # Configuración Tailwind
├── postcss.config.js        # Configuración PostCSS
├── components.json          # Configuración Shadcn UI
├── package.json             # Dependencias
└── .env                     # Variables de entorno
```

---

## 4. Base de Datos

### 4.1 Schema General

La base de datos PostgreSQL contiene 6 tablas principales:

```sql
-- Usuarios y autenticación
users
session

-- CMS y contenido
page_content
downloadable_materials
gallery_items

-- Analytics
analytics
```

### 4.2 Tabla: users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único
- `username`: Nombre de usuario (único)
- `email`: Email (único)
- `password`: Hash de contraseña (bcrypt)
- `role`: Rol del usuario ('admin' o 'user')
- `is_active`: Estado de la cuenta
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

### 4.3 Tabla: session

```sql
CREATE TABLE session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
```

**Uso:** Almacenamiento de sesiones de Express

### 4.4 Tabla: page_content

```sql
CREATE TABLE page_content (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  background_type TEXT DEFAULT 'gradient',
  button_text TEXT,
  button_link TEXT,
  button2_text TEXT,
  button2_link TEXT,
  
  -- Cards de estadísticas (Hero)
  card1_number INTEGER,
  card1_label TEXT,
  card1_description TEXT,
  card2_number INTEGER,
  card2_label TEXT,
  card2_description TEXT,
  card3_number INTEGER,
  card3_label TEXT,
  card3_description TEXT,
  
  -- Instituciones educativas (Hero)
  inst1_title TEXT,
  inst1_description TEXT,
  inst1_link TEXT,
  inst1_image TEXT,
  inst2_title TEXT,
  inst2_description TEXT,
  inst2_link TEXT,
  inst2_image TEXT,
  
  -- Features (About)
  feature1_text TEXT,
  feature2_text TEXT,
  feature3_text TEXT,
  feature4_text TEXT,
  
  -- Team section
  lead_name TEXT,
  lead_role TEXT,
  lead_bio TEXT,
  lead_email TEXT,
  lead_photo TEXT,
  team_card1_title TEXT,
  team_card1_description TEXT,
  team_card2_title TEXT,
  team_card2_description TEXT,
  team_card3_title TEXT,
  team_card3_description TEXT,
  
  -- Phases section (3 fases completas)
  phase1_number INTEGER,
  phase1_title TEXT,
  phase1_description TEXT,
  phase1_sub1_title TEXT,
  phase1_sub1_description TEXT,
  phase1_sub2_title TEXT,
  phase1_sub2_description TEXT,
  phase2_number INTEGER,
  phase2_title TEXT,
  phase2_description TEXT,
  phase2_sub1_title TEXT,
  phase2_sub1_description TEXT,
  phase2_sub2_title TEXT,
  phase2_sub2_description TEXT,
  phase2_sub3_title TEXT,
  phase2_box1_title TEXT,
  phase2_box1_items TEXT,
  phase2_box2_title TEXT,
  phase2_box2_items TEXT,
  phase3_number INTEGER,
  phase3_title TEXT,
  phase3_description TEXT,
  phase3_sub1_title TEXT,
  phase3_sub1_description TEXT,
  phase3_sub2_title TEXT,
  phase3_sub2_description TEXT,
  phase3_box_title TEXT,
  phase3_box_items TEXT,
  
  -- Footer section
  footer_title TEXT,
  footer_description TEXT,
  footer_instit_title TEXT,
  footer_instit1 TEXT,
  footer_instit2 TEXT,
  footer_instit3 TEXT,
  footer_copyright TEXT,
  
  is_visible BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);
```

**Secciones principales:**
- `hero`: Sección principal con estadísticas e instituciones
- `about`: Sobre el proyecto con características
- `team`: Equipo investigativo
- `phases`: Fases del proyecto
- `contact`: Footer con información de contacto

### 4.5 Tabla: downloadable_materials

```sql
CREATE TABLE downloadable_materials (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size TEXT,
  file_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_downloadable_materials_is_active ON downloadable_materials(is_active);
CREATE INDEX idx_downloadable_materials_order ON downloadable_materials("order");
```

**Uso:** Almacena materiales descargables (PDFs, ZIPs, etc.)

### 4.6 Tabla: gallery_items

```sql
CREATE TABLE gallery_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_gallery_items_is_active ON gallery_items(is_active);
CREATE INDEX idx_gallery_items_order ON gallery_items("order");
```

**Uso:** Almacena items de la galería interactiva

### 4.7 Tabla: analytics

```sql
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  source TEXT NOT NULL,
  medium TEXT,
  campaign TEXT,
  user_id INTEGER REFERENCES users(id),
  session_id TEXT NOT NULL,
  is_new_user BOOLEAN NOT NULL DEFAULT true,
  device_type TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  time_on_page INTEGER DEFAULT 0,
  bounced BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT,
  conversion_value INTEGER,
  country TEXT,
  city TEXT,
  visited_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Uso:** Tracking de analytics y métricas de usuario

---

## 5. API Endpoints

### 5.1 Autenticación

#### POST /api/auth/register
Registrar nuevo usuario

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "admin" (opcional)
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "email@ejemplo.com",
    "role": "user",
    "isActive": true
  }
}
```

#### POST /api/auth/login
Iniciar sesión

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "username": "usuario",
    "role": "admin"
  }
}
```

#### POST /api/auth/logout
Cerrar sesión

**Response:**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

#### GET /api/auth/me
Obtener usuario actual

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "usuario",
    "role": "admin"
  }
}
```

### 5.2 CMS - Contenido Principal

#### GET /api/content
Obtener contenido visible (público)

**Response:**
```json
{
  "contents": [
    {
      "id": 1,
      "section": "hero",
      "title": "Conexión Rural 360",
      "subtitle": "Educando en Contexto",
      ...
    }
  ]
}
```

#### GET /api/content/:section
Obtener contenido de una sección específica

**Response:**
```json
{
  "content": {
    "id": 1,
    "section": "hero",
    "title": "...",
    ...
  }
}
```

#### GET /api/cms/content (Admin)
Obtener todo el contenido

#### POST /api/cms/content (Admin)
Crear nueva sección

#### PUT /api/cms/content/:id (Admin)
Actualizar sección

#### DELETE /api/cms/content/:id (Admin)
Eliminar sección

### 5.3 Materiales Descargables

#### GET /api/materials (Público)
Obtener materiales activos

**Response:**
```json
{
  "materials": [
    {
      "id": 1,
      "title": "Marco Teórico",
      "description": "Fundamentos teóricos...",
      "fileType": "PDF",
      "fileSize": "2.5 MB",
      "fileUrl": "https://...",
      "order": 1
    }
  ]
}
```

#### GET /api/cms/materials (Admin)
Obtener todos los materiales

#### POST /api/cms/materials (Admin)
Crear nuevo material

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "fileType": "PDF" | "ZIP" | "XLSX" | etc,
  "fileSize": "string",
  "fileUrl": "string",
  "isActive": boolean,
  "order": number
}
```

#### PUT /api/cms/materials/:id (Admin)
Actualizar material

#### DELETE /api/cms/materials/:id (Admin)
Eliminar material

### 5.4 Galería Interactiva

#### GET /api/gallery (Público)
Obtener items activos de galería

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Talleres territoriales",
      "description": "Descripción...",
      "imageUrl": "https://...",
      "videoUrl": "https://youtube.com/...",
      "order": 1
    }
  ]
}
```

#### GET /api/cms/gallery (Admin)
Obtener todos los items

#### POST /api/cms/gallery (Admin)
Crear nuevo item

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "imageUrl": "string",
  "videoUrl": "string" (opcional),
  "isActive": boolean,
  "order": number
}
```

#### PUT /api/cms/gallery/:id (Admin)
Actualizar item

#### DELETE /api/cms/gallery/:id (Admin)
Eliminar item

### 5.5 Analytics

#### POST /api/analytics/track (Público)
Registrar evento de analytics

#### GET /api/analytics/overview (Admin)
Resumen general de analytics

**Query params:**
- `days`: número de días (default: 30)
- `source`: filtrar por fuente
- `deviceType`: filtrar por tipo de dispositivo
- `pageUrl`: filtrar por página

**Response:**
```json
{
  "overview": {
    "totalVisits": 1000,
    "newUsers": 400,
    "returningUsers": 600,
    "avgTimeOnPage": 120,
    "bounceRate": 35.5,
    "conversions": 50
  }
}
```

#### GET /api/analytics/sources (Admin)
Fuentes de tráfico

#### GET /api/analytics/pages (Admin)
Páginas más visitadas

#### GET /api/analytics/devices (Admin)
Dispositivos usados

#### GET /api/analytics/conversions (Admin)
Conversiones por tipo

#### GET /api/analytics/timeline (Admin)
Visitas por día

### 5.6 Dashboard

#### GET /api/dashboard/users (Admin)
Listar todos los usuarios

#### PUT /api/dashboard/users/:id (Admin)
Actualizar usuario

#### GET /api/dashboard/stats (Admin)
Estadísticas básicas del dashboard

---

## 6. Frontend

### 6.1 Páginas Principales

#### Home (`/`)
Landing page pública con:
- Hero section con estadísticas
- About section
- Team section
- Phases section
- Materiales descargables
- Galería interactiva
- Footer

**Componente:** `client/src/pages/home.tsx`

#### Login (`/login`)
Página de inicio de sesión

**Componente:** `client/src/pages/login.tsx`

#### Register (`/register`)
Página de registro de usuarios

**Componente:** `client/src/pages/register.tsx`

#### Dashboard (`/dashboard`)
Panel principal de administración (solo admin)

**Componente:** `client/src/pages/dashboard.tsx`

#### Analytics (`/analytics`)
Sistema de analytics avanzado (solo admin)

**Componente:** `client/src/pages/analytics-enhanced.tsx`

#### Content Management (`/content-management`)
Gestión de contenido de la página principal (solo admin)

**Componente:** `client/src/pages/content-management.tsx`

#### Materials Management (`/materials-management`)
Gestión de materiales descargables (solo admin)

**Componente:** `client/src/pages/materials-management.tsx`

#### Gallery Management (`/gallery-management`)
Gestión de galería interactiva (solo admin)

**Componente:** `client/src/pages/gallery-management.tsx`

### 6.2 Componentes Reutilizables

**Ubicación:** `client/src/components/ui/`

Componentes de Shadcn UI:
- `button.tsx` - Botones
- `card.tsx` - Cards
- `input.tsx` - Inputs
- `textarea.tsx` - Textareas
- `switch.tsx` - Switches
- `dialog.tsx` - Modales
- `table.tsx` - Tablas
- `badge.tsx` - Badges
- `toast.tsx` - Notificaciones
- Y más...

### 6.3 Custom Hooks

#### useAnalytics
Hook para tracking automático de analytics

```typescript
// Uso en App.tsx
useAnalytics();
```

#### useAnime
Hook para animaciones con anime.js

```typescript
const { animateElement } = useAnime();
```

#### useMobile
Hook para detectar dispositivos móviles

```typescript
const isMobile = useMobile();
```

#### useToast
Hook para notificaciones

```typescript
const { toast } = useToast();

toast({
  title: "Éxito",
  description: "Operación completada"
});
```

### 6.4 Estado Global

**TanStack Query** se usa para:
- Cache de datos
- Sincronización servidor-cliente
- Loading/Error states
- Refetch automático

**Configuración:** `client/src/lib/queryClient.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});
```

### 6.5 Routing

**Wouter** se usa para routing en el cliente

```typescript
// App.tsx
<Switch>
  <Route path="/" component={Home} />
  <Route path="/login" component={LoginPage} />
  <Route path="/dashboard" component={DashboardPage} />
  ...
</Switch>
```

---

## 7. Sistema de Autenticación

### 7.1 Flujo de Autenticación

```
1. Usuario envía credenciales (POST /api/auth/login)
   ↓
2. Backend verifica con bcrypt
   ↓
3. Si es válido, crea sesión con Passport
   ↓
4. Sesión se almacena en PostgreSQL
   ↓
5. Cookie de sesión se envía al cliente
   ↓
6. Cliente incluye cookie en requests subsecuentes
   ↓
7. Backend verifica sesión con middleware
```

### 7.2 Middleware de Autenticación

**isAuthenticated:**
```typescript
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autenticado" });
};
```

**isAdmin:**
```typescript
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && (req.user as any).role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Acceso denegado" });
};
```

### 7.3 Estrategia de Passport

```typescript
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Contraseña incorrecta" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
```

### 7.4 Roles y Permisos

**Roles:**
- `user`: Usuario regular (solo lectura)
- `admin`: Administrador (acceso completo)

**Permisos:**
```
┌─────────────────┬──────┬────────┐
│ Recurso         │ User │ Admin  │
├─────────────────┼──────┼────────┤
│ Ver home        │  ✅  │   ✅   │
│ Ver analytics   │  ❌  │   ✅   │
│ Editar CMS      │  ❌  │   ✅   │
│ Gestionar users │  ❌  │   ✅   │
│ Ver dashboard   │  ❌  │   ✅   │
└─────────────────┴──────┴────────┘
```

---

## 8. Sistemas CMS Implementados

### 8.1 CMS Principal (Page Content)

**Ubicación:** `/content-management`

**Funcionalidades:**
- Editar secciones de la página principal
- Gestionar hero section con estadísticas
- Gestionar instituciones educativas
- Gestionar features y team
- Gestionar fases del proyecto
- Gestionar footer

**Secciones editables:**
- `hero`: Portada principal
- `about`: Sobre el proyecto
- `team`: Equipo investigativo
- `phases`: Fases del proyecto
- `contact`: Footer

### 8.2 CMS de Materiales Descargables

**Ubicación:** `/materials-management`

**Funcionalidades:**
- CRUD completo de materiales
- Soporte para múltiples tipos de archivo
- Vista previa de información
- Control de orden y visibilidad
- Estadísticas en dashboard

**Tipos de archivo soportados:**
- PDF
- ZIP
- XLSX
- DOCX
- VIDEO
- IMAGE
- OTRO

### 8.3 CMS de Galería Interactiva

**Ubicación:** `/gallery-management`

**Funcionalidades:**
- CRUD completo de items de galería
- Vista previa de imágenes en tiempo real
- Integración con videos
- Control de orden y visibilidad
- Estadísticas en dashboard

**Campos:**
- Título
- Descripción
- URL de imagen (con preview)
- URL de video (opcional)
- Estado y orden

---

## 9. Configuración y Despliegue

### 9.1 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db

# Sesión
SESSION_SECRET=tu-secreto-muy-seguro-aqui

# Puerto del servidor
PORT=5000

# Ambiente
NODE_ENV=development
```

### 9.2 Instalación Local

```bash
# 1. Clonar repositorio
git clone [url-del-repo]
cd ConexionRural

# 2. Instalar dependencias
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# 4. Aplicar migraciones
node aplicar-migracion-materials.js
node aplicar-migracion-gallery.js

# 5. Iniciar servidor de desarrollo
npm run dev
```

### 9.3 Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "check": "tsc --noEmit"
}
```

### 9.4 Despliegue en Producción

#### Opción 1: Replit

1. Crear nuevo Repl
2. Importar repositorio
3. Configurar variables de entorno
4. Click en "Run"

#### Opción 2: Servidor VPS

```bash
# 1. Construir aplicación
npm run build

# 2. Instalar PM2 (gestor de procesos)
npm install -g pm2

# 3. Iniciar con PM2
pm2 start npm --name "conexion-rural" -- start

# 4. Configurar Nginx como reverse proxy
# Editar /etc/nginx/sites-available/default

# 5. Reiniciar Nginx
sudo systemctl restart nginx
```

#### Opción 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

```bash
# Construir y ejecutar
docker build -t conexion-rural .
docker run -p 5000:5000 --env-file .env conexion-rural
```

### 9.5 Configuración de Base de Datos

**PostgreSQL local (Laragon):**
```bash
# Iniciar Laragon y PostgreSQL
# Acceder a pgAdmin o psql
psql -U postgres

CREATE DATABASE conexion_rural;
```

**PostgreSQL en la nube (Neon, Supabase, etc.):**
1. Crear base de datos
2. Copiar URL de conexión
3. Actualizar `DATABASE_URL` en `.env`

---

## 10. Guía de Desarrollo

### 10.1 Agregar Nueva Ruta API

1. **Definir en `server/routes.ts`:**

```typescript
app.get("/api/mi-nueva-ruta", isAuthenticated, async (req, res) => {
  try {
    // Lógica aquí
    res.json({ data: "resultado" });
  } catch (error) {
    res.status(500).json({ error: "mensaje" });
  }
});
```

2. **Agregar middleware si es necesario:**

```typescript
app.post("/api/admin-ruta", isAuthenticated, isAdmin, async (req, res) => {
  // Solo admins pueden acceder
});
```

### 10.2 Agregar Nueva Tabla

1. **Definir schema en `shared/schema.ts`:**

```typescript
export const miTabla = pgTable("mi_tabla", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMiTablaSchema = createInsertSchema(miTabla);
export type MiTabla = typeof miTabla.$inferSelect;
```

2. **Crear migración SQL:**

```sql
-- database-migration-mi-tabla.sql
CREATE TABLE mi_tabla (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Crear script de migración:**

```javascript
// aplicar-migracion-mi-tabla.js
// Similar a scripts existentes
```

### 10.3 Agregar Nueva Página

1. **Crear componente en `client/src/pages/`:**

```typescript
// mi-pagina.tsx
export default function MiPagina() {
  return (
    <div>
      <h1>Mi Nueva Página</h1>
    </div>
  );
}
```

2. **Agregar ruta en `client/src/App.tsx`:**

```typescript
import MiPagina from "@/pages/mi-pagina";

<Route path="/mi-pagina" component={MiPagina} />
```

### 10.4 Usar TanStack Query

```typescript
// Obtener datos
const { data, isLoading, error } = useQuery({
  queryKey: ["mi-data"],
  queryFn: async () => {
    const response = await fetch("/api/mi-ruta");
    return response.json();
  },
});

// Mutar datos
const mutation = useMutation({
  mutationFn: async (datos) => {
    const response = await fetch("/api/mi-ruta", {
      method: "POST",
      body: JSON.stringify(datos),
    });
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["mi-data"] });
  },
});
```

### 10.5 Agregar Componente UI

```bash
# Agregar componente de Shadcn
npx shadcn-ui@latest add [nombre-componente]
```

### 10.6 Debugging

**Backend:**
```typescript
console.log("Debug:", variable);
```

**Frontend:**
```typescript
console.log("Debug:", data);
// o usar React DevTools
```

**Base de datos:**
```bash
# Acceder a psql
psql -U postgres -d conexion_rural

# Ver tablas
\dt

# Consultar datos
SELECT * FROM users;
```

---

## 11. Mantenimiento

### 11.1 Backup de Base de Datos

```bash
# Hacer backup
pg_dump -U postgres conexion_rural > backup.sql

# Restaurar backup
psql -U postgres conexion_rural < backup.sql
```

### 11.2 Actualizar Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas
npm update

# Actualizar específica
npm install [paquete]@latest
```

### 11.3 Limpiar Base de Datos

```sql
-- Limpiar tabla de analytics antiguos
DELETE FROM analytics WHERE visited_at < NOW() - INTERVAL '90 days';

-- Limpiar sesiones expiradas
DELETE FROM session WHERE expire < NOW();
```

### 11.4 Monitoreo

**Logs del servidor:**
```bash
# Con PM2
pm2 logs conexion-rural

# Ver uso de recursos
pm2 monit
```

**Métricas de analytics:**
- Acceder a `/analytics` en el dashboard
- Revisar estadísticas regularmente
- Exportar reportes si es necesario

### 11.5 Optimización

**Base de datos:**
```sql
-- Crear índices adicionales si es necesario
CREATE INDEX idx_nombre ON tabla(campo);

-- Analizar performance
EXPLAIN ANALYZE SELECT * FROM tabla WHERE condicion;
```

**Frontend:**
- Lazy loading de componentes
- Optimización de imágenes
- Code splitting
- Minificación en producción

---

## 12. Troubleshooting

### 12.1 Error: Cannot connect to database

**Problema:** `Error: connect ECONNREFUSED`

**Solución:**
1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Verificar puerto de la base de datos

```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Reiniciar si es necesario
sudo systemctl restart postgresql
```

### 12.2 Error: Session not found

**Problema:** `Error: Session store not ready`

**Solución:**
1. Verificar que tabla `session` existe
2. Verificar configuración de express-session
3. Limpiar cookies del navegador

```sql
-- Crear tabla session si no existe
CREATE TABLE session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
```

### 12.3 Error: Port already in use

**Problema:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solución:**
```bash
# Encontrar proceso usando el puerto
lsof -i :5000

# Matar proceso
kill -9 [PID]

# O cambiar puerto en .env
PORT=5001
```

### 12.4 Error: Module not found

**Problema:** `Error: Cannot find module '@/components/...'`

**Solución:**
1. Verificar alias en `tsconfig.json`
2. Reinstalar dependencias
3. Reiniciar servidor de desarrollo

```bash
rm -rf node_modules package-lock.json
npm install
```

### 12.5 Error: Authentication failed

**Problema:** Usuario no puede iniciar sesión

**Solución:**
1. Verificar credenciales correctas
2. Verificar que usuario existe y está activo
3. Verificar hash de contraseña

```sql
-- Verificar usuario
SELECT id, username, email, is_active, role FROM users WHERE username = 'tu-usuario';

-- Reactivar usuario si está inactivo
UPDATE users SET is_active = true WHERE username = 'tu-usuario';
```

### 12.6 Error: Images not loading

**Problema:** Imágenes no se cargan en galería

**Solución:**
1. Verificar URLs de imágenes son accesibles
2. Verificar CORS del servidor de imágenes
3. Usar URLs de CDN públicos (Unsplash, Cloudinary)

### 12.7 Performance Issues

**Problema:** La aplicación es lenta

**Solución:**
1. **Backend:**
   - Agregar índices a tablas
   - Optimizar queries SQL
   - Implementar paginación

2. **Frontend:**
   - Implementar lazy loading
   - Optimizar imágenes
   - Reducir re-renders innecesarios

3. **Base de datos:**
   ```sql
   -- Ver queries lentas
   SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
   ```

---

## 📞 Soporte y Contacto

Para problemas técnicos o consultas:

1. Revisar esta documentación
2. Revisar guías específicas (`GUIA-*.md`)
3. Revisar logs del servidor
4. Revisar consola del navegador
5. Contactar al desarrollador

---

## 📋 Checklist de Deployment

Antes de desplegar a producción:

- [ ] Variables de entorno configuradas
- [ ] Base de datos respaldada
- [ ] Migraciones aplicadas
- [ ] Dependencias actualizadas
- [ ] Tests ejecutados
- [ ] Build de producción probado
- [ ] SSL/HTTPS configurado
- [ ] Logs configurados
- [ ] Monitoreo configurado
- [ ] Backup automático configurado

---

## 🔐 Seguridad

**Prácticas implementadas:**
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones seguras con express-session
- ✅ Validación de datos con Zod
- ✅ Protección CSRF
- ✅ Sanitización de inputs
- ✅ Rate limiting (recomendado agregar)
- ✅ HTTPS en producción (recomendado)

**Recomendaciones adicionales:**
- Implementar rate limiting con express-rate-limit
- Configurar helmet.js para headers de seguridad
- Implementar 2FA para admins
- Auditorías de seguridad regulares

---

## 📚 Referencias

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Versión del Manual**: 1.0  
**Última Actualización**: Enero 2025  
**Autor**: Equipo de Desarrollo Conexión Rural 360

---

© 2025 Conexión Rural 360. Todos los derechos reservados.



