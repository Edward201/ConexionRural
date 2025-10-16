# ⚡ Inicio Rápido - Dashboard con Login

## 🎯 Resumen
Sistema completo de autenticación con dashboard administrativo implementado con:
- **Backend:** Express + Passport.js + PostgreSQL
- **Frontend:** React + Radix UI + TanStack Query
- **Seguridad:** bcrypt para passwords, sesiones seguras

---

## 🚀 5 Pasos para Empezar

### 1️⃣ Configurar Base de Datos
```bash
# Inicia PostgreSQL en Laragon
# Luego ejecuta (ajusta -U postgres si tu usuario es diferente):
psql -U postgres -c "CREATE DATABASE conexion_rural;"
```

### 2️⃣ Configurar Variables de Entorno
```bash
# Renombrar archivo de ejemplo
mv env.local.txt .env

# Editar .env con tus credenciales de PostgreSQL
# DATABASE_URL=postgresql://postgres:password@localhost:5432/conexion_rural
```

### 3️⃣ Crear Tablas
```bash
npm run db:push
```

### 4️⃣ Crear Usuario Admin
```bash
npm run db:seed
```
**Credenciales creadas:**
- Usuario: `admin` | Password: `admin123`
- Usuario: `usuario_prueba` | Password: `test123`

### 5️⃣ Iniciar Servidor
```bash
npm run dev
```
Abre: **http://localhost:5000/login**

---

## 📍 Rutas Disponibles

| Ruta | Descripción | Acceso |
|------|------------|--------|
| `/login` | Página de inicio de sesión | Público |
| `/register` | Registro de nuevos usuarios | Público |
| `/dashboard` | Panel administrativo | Solo Admin |
| `/` | Página principal | Público |

---

## 🔌 API Endpoints

### Autenticación
```bash
# Registrar usuario
POST /api/auth/register
Body: { username, email, password }

# Login
POST /api/auth/login
Body: { username, password }

# Logout
POST /api/auth/logout

# Usuario actual
GET /api/auth/me
```

### Dashboard (requiere admin)
```bash
# Estadísticas
GET /api/dashboard/stats

# Listar usuarios
GET /api/dashboard/users

# Actualizar usuario
PUT /api/dashboard/users/:id
Body: { username?, email?, role?, isActive? }
```

---

## 🎨 Características Implementadas

✅ Login con validación de credenciales  
✅ Registro de nuevos usuarios  
✅ Roles de usuario (admin/user)  
✅ Dashboard administrativo con:
  - Estadísticas en tiempo real
  - Gestión de usuarios
  - Activar/desactivar usuarios
  - Vista de tabla con filtros  
✅ Sesiones persistentes  
✅ Protección de rutas por rol  
✅ Passwords hasheadas con bcrypt  
✅ Validación con Zod  
✅ UI moderna con Radix UI  
✅ Notificaciones toast  

---

## 📦 Componentes de UI Disponibles

Ya tienes **todos** los componentes de Radix UI instalados:
- Button, Card, Table, Badge, Switch
- Input, Label, Form
- Dialog, Alert, Toast
- Y 40+ componentes más...

Úsalos para extender el dashboard según tus necesidades.

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Base de Datos
npm run db:push          # Sincroniza schema con DB
npm run db:seed          # Crea usuario admin

# Producción
npm run build            # Compila frontend + backend
npm start                # Inicia en producción

# TypeScript
npm run check            # Verifica tipos
```

---

## 🐛 Problemas Comunes

**Error: "DATABASE_URL no está definido"**
→ Crea el archivo `.env` desde `env.local.txt`

**Error: "relation users does not exist"**
→ Ejecuta `npm run db:push`

**Error: "Connection refused"**
→ Verifica que PostgreSQL esté corriendo en Laragon

**No puedo hacer login**
→ Ejecuta `npm run db:seed` para crear el usuario admin

---

## 📚 Próximos Pasos

Ahora puedes extender el dashboard con:
1. Más estadísticas y gráficos (Recharts ya está instalado)
2. CRUD de contenido específico de tu app
3. Subida de archivos
4. Notificaciones en tiempo real (WebSocket ya está instalado)
5. Reportes y exportación de datos

Todo el stack está listo para escalar 🚀

---

## 📖 Documentación Completa

Ver **SETUP-AUTH.md** para:
- Configuración detallada paso a paso
- Solución de problemas avanzados
- Arquitectura del sistema
- Mejores prácticas de seguridad

