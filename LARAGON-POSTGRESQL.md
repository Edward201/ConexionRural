# 🐘 Configurar PostgreSQL en Laragon - Guía Paso a Paso

## 📋 Tabla de Contenidos
1. [Verificar si PostgreSQL está instalado](#1-verificar-instalación)
2. [Instalar PostgreSQL en Laragon](#2-instalar-postgresql)
3. [Iniciar PostgreSQL](#3-iniciar-postgresql)
4. [Acceder a PostgreSQL](#4-acceder-a-postgresql)
5. [Crear la Base de Datos](#5-crear-base-de-datos)
6. [Configurar .env](#6-configurar-env)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## 1️⃣ Verificar Instalación

### Abrir Laragon
1. Busca el ícono de Laragon en la bandeja del sistema (esquina inferior derecha)
2. Clic derecho en el ícono de Laragon

### Verificar PostgreSQL
3. Ve a **Menu** → **PostgreSQL**
4. Si ves opciones como "Start", "Stop", "Version", **ya está instalado** ✅
5. Si ves "Add Version" o está vacío, necesitas instalarlo ⬇️

---

## 2️⃣ Instalar PostgreSQL (Si no está instalado)

### Opción A: Instalación Automática desde Laragon

1. **Clic derecho en Laragon** → **Menu** → **PostgreSQL** → **Add Version**
2. Selecciona una versión (recomendado: **PostgreSQL 14** o superior)
3. Espera a que descargue e instale
4. Una vez instalado, verás "PostgreSQL 14" en el menú

### Opción B: Instalación Manual

1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Instala PostgreSQL (deja opciones por defecto)
3. **Importante:** Anota la contraseña del usuario `postgres` que configures
4. En Laragon, ve a **Menu** → **PostgreSQL** → **Add Version**
5. Busca la carpeta donde instalaste PostgreSQL (ej: `C:\Program Files\PostgreSQL\14`)

### Opción C: Instalación Portable

1. Descarga PostgreSQL portable desde: https://www.enterprisedb.com/download-postgresql-binaries
2. Extrae el zip en: `C:\laragon\bin\postgresql\postgresql-14.x-winx64`
3. Reinicia Laragon
4. PostgreSQL debería aparecer automáticamente

---

## 3️⃣ Iniciar PostgreSQL

### Método Visual (Recomendado)

1. **Clic derecho en Laragon**
2. **Menu** → **PostgreSQL** → **Start**
3. Espera unos segundos
4. Verifica que el ícono de Laragon se ponga verde ✅

### Método Terminal

```powershell
# Abrir terminal de Laragon
# Clic derecho → Menu → Terminal

# Iniciar PostgreSQL
pg_ctl -D "C:\laragon\data\postgresql\14" start
```

### Verificar que está corriendo

```powershell
# En la terminal de Laragon
psql --version

# Deberías ver algo como:
# psql (PostgreSQL) 14.x
```

---

## 4️⃣ Acceder a PostgreSQL

### Credenciales por Defecto de Laragon

```
Usuario: postgres
Contraseña: (vacía o "password")
Host: localhost
Puerto: 5432
```

### Método 1: Desde Terminal de Laragon

```powershell
# Abrir terminal de Laragon
# Clic derecho → Menu → Terminal

# Conectar a PostgreSQL
psql -U postgres

# Si pide contraseña, intenta:
# 1. Presiona Enter (contraseña vacía)
# 2. Escribe: password
```

### Método 2: Usando pgAdmin

1. **Clic derecho en Laragon** → **PostgreSQL** → **pgAdmin**
2. Si es la primera vez, pedirá una "Master Password" (elige una y guárdala)
3. En el panel izquierdo: **Servers** → **Clic derecho** → **Register** → **Server**
4. Configurar:
   - **General Tab:**
     - Name: `Laragon PostgreSQL`
   - **Connection Tab:**
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (vacía o "password")
     - Save Password: ✅
5. Clic en **Save**

### Método 3: Desde PowerShell Normal

```powershell
# Agregar PostgreSQL al PATH (solo una vez)
cd "C:\laragon\bin\postgresql\postgresql-14\bin"

# Conectar
.\psql.exe -U postgres -h localhost
```

---

## 5️⃣ Crear la Base de Datos

### Opción A: Desde Terminal (Recomendado)

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear la base de datos
CREATE DATABASE conexion_rural;

-- Verificar que se creó
\l

-- Salir
\q
```

### Opción B: Desde pgAdmin (Visual)

1. Abre pgAdmin
2. Expande: **Servers** → **Laragon PostgreSQL** → **Databases**
3. **Clic derecho en "Databases"** → **Create** → **Database...**
4. En "Database":
   - **Database:** `conexion_rural`
   - **Owner:** `postgres`
5. Clic en **Save**
6. ¡Listo! Deberías ver `conexion_rural` en la lista

### Opción C: Usando el Script SQL

```powershell
# Desde la raíz de tu proyecto
psql -U postgres -f database-setup.sql
```

---

## 6️⃣ Configurar .env

### Paso 1: Renombrar archivo

```powershell
# Desde la raíz del proyecto
cd C:\laragon\www\ConexionRural
mv env.local.txt .env
```

O manualmente:
1. Abre el explorador de archivos
2. Renombra `env.local.txt` a `.env`
3. Si Windows no te deja, habilita extensiones de archivo

### Paso 2: Editar .env

Abre `.env` con tu editor favorito y configura:

```env
# Si NO configuraste contraseña:
DATABASE_URL=postgresql://postgres@localhost:5432/conexion_rural

# Si SÍ configuraste contraseña:
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/conexion_rural

# Genera un secreto aleatorio (puedes usar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

PORT=5000
NODE_ENV=development
```

### Generar SESSION_SECRET seguro

```powershell
# Ejecuta en PowerShell:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copia el resultado al .env
```

---

## 7️⃣ Solución de Problemas

### ❌ "psql: error: connection refused"

**Causa:** PostgreSQL no está corriendo

**Solución:**
```powershell
# Iniciar PostgreSQL desde Laragon
# Clic derecho → Menu → PostgreSQL → Start

# O manualmente:
pg_ctl -D "C:\laragon\data\postgresql\14" start
```

---

### ❌ "psql: FATAL: password authentication failed"

**Causa:** Contraseña incorrecta

**Solución:**

**Opción 1: Resetear contraseña**
1. Busca el archivo `pg_hba.conf`:
   ```
   C:\laragon\data\postgresql\14\pg_hba.conf
   ```
2. Cambia todas las líneas que digan `md5` o `scram-sha-256` a `trust`
3. Guarda y reinicia PostgreSQL
4. Conecta sin contraseña y cámbiala:
   ```sql
   ALTER USER postgres WITH PASSWORD 'nueva_password';
   ```
5. Vuelve a cambiar `trust` a `scram-sha-256` en `pg_hba.conf`
6. Reinicia PostgreSQL

**Opción 2: Usar autenticación de Windows**
```powershell
psql -U postgres -h localhost -W
# Luego ingresa la contraseña cuando te la pida
```

---

### ❌ "database 'conexion_rural' does not exist"

**Causa:** No creaste la base de datos

**Solución:**
```sql
psql -U postgres
CREATE DATABASE conexion_rural;
\q
```

---

### ❌ "relation 'users' does not exist"

**Causa:** No creaste las tablas

**Solución:**
```powershell
# Opción 1: Usar Drizzle Kit
npm run db:push

# Opción 2: Ejecutar SQL manualmente
psql -U postgres -d conexion_rural -f database-setup.sql
```

---

### ❌ Puerto 5432 ya está en uso

**Causa:** Otra instancia de PostgreSQL está corriendo

**Solución:**

**Opción 1: Detener otra instancia**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :5432

# Detener el proceso (reemplaza PID con el número que viste)
taskkill /PID <número> /F
```

**Opción 2: Cambiar puerto en Laragon**
1. Edita `postgresql.conf`:
   ```
   C:\laragon\data\postgresql\14\postgresql.conf
   ```
2. Busca la línea: `port = 5432`
3. Cámbiala a: `port = 5433`
4. Actualiza tu `.env`:
   ```
   DATABASE_URL=postgresql://postgres@localhost:5433/conexion_rural
   ```
5. Reinicia PostgreSQL

---

### ❌ "pg_ctl: command not found"

**Causa:** PostgreSQL no está en el PATH

**Solución:**
```powershell
# Agregar temporalmente al PATH
$env:Path += ";C:\laragon\bin\postgresql\postgresql-14\bin"

# O navegar a la carpeta
cd "C:\laragon\bin\postgresql\postgresql-14\bin"
.\psql.exe -U postgres
```

---

### ❌ pgAdmin no abre

**Solución:**

**Opción 1: Descargar pgAdmin standalone**
https://www.pgadmin.org/download/

**Opción 2: Usar alternativas**
- **DBeaver:** https://dbeaver.io/
- **TablePlus:** https://tableplus.com/
- **DataGrip:** https://www.jetbrains.com/datagrip/

---

## ✅ Verificación Final

Ejecuta estos comandos para confirmar que todo está listo:

```powershell
# 1. PostgreSQL está corriendo
psql -U postgres -c "SELECT version();"

# 2. Base de datos existe
psql -U postgres -c "\l" | findstr conexion_rural

# 3. Archivo .env existe
cat .env

# 4. Crear tablas
npm run db:push

# 5. Crear usuario admin
npm run db:seed

# 6. Iniciar servidor
npm run dev
```

Si todos estos pasos funcionan, ¡estás listo! 🎉

---

## 🔗 Enlaces Útiles

- **Documentación PostgreSQL:** https://www.postgresql.org/docs/
- **Laragon Docs:** https://laragon.org/docs/
- **pgAdmin Docs:** https://www.pgadmin.org/docs/

---

## 📞 Comandos Rápidos de Referencia

```sql
-- Ver bases de datos
\l

-- Conectar a una base de datos
\c conexion_rural

-- Ver tablas
\dt

-- Ver estructura de tabla
\d users

-- Ver usuarios de PostgreSQL
\du

-- Salir
\q
```

```powershell
# Iniciar PostgreSQL
pg_ctl -D "C:\laragon\data\postgresql\14" start

# Detener PostgreSQL
pg_ctl -D "C:\laragon\data\postgresql\14" stop

# Ver estado
pg_ctl -D "C:\laragon\data\postgresql\14" status

# Conectar a PostgreSQL
psql -U postgres

# Conectar a una base específica
psql -U postgres -d conexion_rural
```

---

**¡Todo listo para desarrollar!** 🚀

