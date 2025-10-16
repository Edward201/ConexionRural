# 🚀 Configuración Rápida con Neon (PostgreSQL Cloud)

## ⚡ La forma más rápida de empezar (5 minutos)

Si no quieres instalar PostgreSQL localmente, usa **Neon** (gratis hasta 0.5GB).

---

## 📝 Pasos

### 1. Crear cuenta en Neon (2 min)

1. Ve a: https://neon.tech
2. Clic en **Sign Up**
3. Regístrate con:
   - GitHub (más rápido)
   - Google
   - Email

### 2. Crear base de datos (1 min)

1. Una vez dentro, clic en **Create Project**
2. Configuración:
   - **Project name:** `ConexionRural` (o el que quieras)
   - **Region:** Elige el más cercano (ej: `US East (Ohio)`)
   - **PostgreSQL version:** 16 (por defecto está bien)
3. Clic en **Create Project**

### 3. Copiar CONNECTION STRING (30 seg)

1. En el dashboard verás: **Connection Details**
2. Copia el **Connection String** (algo como):
   ```
   postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **Guárdalo**, lo necesitarás en el siguiente paso

### 4. Configurar .env (1 min)

```powershell
# En tu proyecto, renombra el archivo
cd C:\laragon\www\ConexionRural
move env.local.txt .env
```

Abre el archivo `.env` y pega tu connection string:

```env
# Reemplaza esta línea con tu connection string de Neon:
DATABASE_URL=postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Genera un secreto aleatorio (o usa el que prefieras):
SESSION_SECRET=mi_secreto_super_seguro_cambiar_en_produccion_12345

PORT=5000
NODE_ENV=development
```

### 5. Crear tablas (30 seg)

```powershell
npm run db:push
```

### 6. Crear usuario admin (30 seg)

```powershell
npm run db:seed
```

### 7. Iniciar servidor (30 seg)

```powershell
npm run dev
```

---

## ✅ ¡Listo!

Abre: **http://localhost:5000/login**

Credenciales:
- Usuario: `admin`
- Password: `admin123`

---

## 💡 Ventajas de Neon

✅ No requiere instalación local  
✅ Gratis hasta 0.5GB  
✅ Backups automáticos  
✅ Accesible desde cualquier lugar  
✅ Compatible con el código (ya tienes @neondatabase/serverless)  
✅ Funciona igual que PostgreSQL local  

---

## 🔗 Ver datos en Neon

1. Ve a: https://console.neon.tech
2. Selecciona tu proyecto
3. Clic en **SQL Editor**
4. Ejecuta:
   ```sql
   SELECT * FROM users;
   ```

---

## 🔄 Cambiar a PostgreSQL Local después

Si más tarde quieres usar PostgreSQL local:

1. Instala PostgreSQL en Laragon (ver LARAGON-POSTGRESQL.md)
2. Cambia `DATABASE_URL` en `.env`
3. Ejecuta `npm run db:push` de nuevo

El código es el mismo, solo cambias la URL de conexión.

---

**¡Listo para empezar en 5 minutos!** 🚀

