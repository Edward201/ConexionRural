# 🚀 Guía de Configuración - Sistema de Autenticación

## 📋 Prerequisitos

- ✅ Node.js v18+ instalado
- ✅ PostgreSQL instalado en Laragon
- ✅ Dependencias instaladas (`npm install` completado)

---

## 🗄️ Paso 1: Configurar PostgreSQL en Laragon

### Opción A: Si PostgreSQL ya está instalado en Laragon

1. Abre **Laragon**
2. Clic derecho en Laragon > **PostgreSQL** > **Start**
3. Verifica que esté corriendo (ícono verde)

### Opción B: Si necesitas instalar PostgreSQL

1. Clic derecho en Laragon > **PostgreSQL** > **Add version**
2. Selecciona la versión a instalar
3. Inicia PostgreSQL

### Credenciales por Defecto de Laragon:
```
Usuario: postgres
Contraseña: (vacío o "password")
Host: localhost
Puerto: 5432
```

---

## 🗃️ Paso 2: Crear la Base de Datos

### Opción A: Usando pgAdmin (GUI)

1. Abre pgAdmin desde Laragon: `Clic derecho > PostgreSQL > pgAdmin`
2. Conéctate al servidor local
3. Clic derecho en **Databases** > **Create** > **Database**
4. Nombre: `conexion_rural`
5. Guarda

### Opción B: Usando Terminal

```bash
# Abrir terminal de PostgreSQL en Laragon
# O ejecutar desde PowerShell:

psql -U postgres

# Dentro de psql:
CREATE DATABASE conexion_rural;
\q
```

### Opción C: Usando el script SQL incluido

```bash
psql -U postgres -f database-setup.sql
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno

1. Renombra el archivo `env.local.txt` a `.env`:
   ```bash
   mv env.local.txt .env
   ```

2. Edita el archivo `.env` con tus credenciales:
   ```env
   DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/conexion_rural
   SESSION_SECRET=genera_una_clave_secreta_aleatoria_aqui
   PORT=5000
   NODE_ENV=development
   ```

   **Importante:** Cambia `TU_PASSWORD` por tu contraseña de PostgreSQL.

---

## 🏗️ Paso 4: Crear las Tablas

### Opción A: Usando Drizzle Kit (Recomendado)

```bash
npm run db:push
```

Este comando creará automáticamente todas las tablas según el schema definido.

### Opción B: Ejecutar SQL manualmente

Si `db:push` falla, ejecuta el script SQL incluido:

```bash
psql -U postgres -d conexion_rural -f database-setup.sql
```

---

## 🌱 Paso 5: Inicializar Datos (Seed)

Crea un usuario administrador por defecto:

```bash
npx tsx server/seed.ts
```

Esto creará:
- **Usuario Admin:**
  - Usuario: `admin`
  - Password: `admin123`
  - Email: `admin@conexionrural.com`
  - Rol: `admin`

- **Usuario de Prueba:**
  - Usuario: `usuario_prueba`
  - Password: `test123`
  - Email: `usuario@test.com`
  - Rol: `user`

⚠️ **IMPORTANTE:** Cambia la contraseña del admin después del primer login.

---

## 🚀 Paso 6: Iniciar el Servidor

```bash
npm run dev
```

El servidor iniciará en: **http://localhost:5000**

---

## 🎯 Probar el Sistema

### 1. Ir a Login
Abre tu navegador: **http://localhost:5000/login**

### 2. Iniciar Sesión como Admin
```
Usuario: admin
Contraseña: admin123
```

### 3. Acceder al Dashboard
Una vez autenticado, serás redirigido a: **http://localhost:5000/dashboard**

### 4. Probar Registro
Ve a: **http://localhost:5000/register** para crear nuevos usuarios

---

## 📍 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Dashboard (Solo Admin)
- `GET /api/dashboard/stats` - Estadísticas del sistema
- `GET /api/dashboard/users` - Listar todos los usuarios
- `PUT /api/dashboard/users/:id` - Actualizar usuario

---

## 🔐 Estructura de Usuario

```typescript
{
  id: number;
  username: string;
  email: string;
  password: string; // hasheado con bcrypt
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🐛 Solución de Problemas

### Error: "DATABASE_URL no está definido"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Confirma que la variable `DATABASE_URL` está correctamente escrita

### Error: "Connection refused"
- Verifica que PostgreSQL esté corriendo en Laragon
- Confirma el puerto (por defecto 5432)
- Verifica las credenciales en `.env`

### Error: "Relation 'users' does not exist"
- Ejecuta: `npm run db:push`
- O crea las tablas manualmente con el script SQL

### Error al hacer seed
- Verifica que la base de datos y tablas existan
- Confirma que el archivo `.env` está configurado
- Si el admin ya existe, es normal que no se cree de nuevo

---

## 📦 Dependencias Nuevas Instaladas

```json
{
  "bcryptjs": "Hashing de contraseñas",
  "cross-env": "Variables de entorno multiplataforma"
}
```

---

## 📁 Archivos Creados

### Backend
- `server/db.ts` - Cliente de base de datos
- `server/auth.ts` - Configuración de Passport.js
- `server/storage.ts` - Capa de acceso a datos (actualizado)
- `server/routes.ts` - Rutas de API (actualizado)
- `server/seed.ts` - Script de inicialización

### Frontend
- `client/src/pages/login.tsx` - Página de login
- `client/src/pages/register.tsx` - Página de registro
- `client/src/pages/dashboard.tsx` - Dashboard administrativo
- `client/src/App.tsx` - Rutas actualizadas

### Configuración
- `shared/schema.ts` - Schema de base de datos (actualizado)
- `env.local.txt` - Plantilla de variables de entorno
- `database-setup.sql` - Script SQL de configuración

---

## ✅ Checklist Final

- [ ] PostgreSQL corriendo en Laragon
- [ ] Base de datos `conexion_rural` creada
- [ ] Archivo `.env` configurado
- [ ] Tablas creadas (`npm run db:push`)
- [ ] Seed ejecutado (`npx tsx server/seed.ts`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Login funcional en http://localhost:5000/login
- [ ] Dashboard accesible en http://localhost:5000/dashboard

---

## 🎉 ¡Listo!

Tu sistema de autenticación está completamente configurado. Ahora puedes:

1. **Crear usuarios** desde `/register`
2. **Iniciar sesión** desde `/login`
3. **Gestionar usuarios** desde `/dashboard` (solo admin)
4. **Agregar más funcionalidad** al dashboard según tus necesidades

---

## 📧 Soporte

Si encuentras algún problema, revisa:
1. Los logs del servidor en la terminal
2. La consola del navegador (F12)
3. Los errores de PostgreSQL en los logs de Laragon

