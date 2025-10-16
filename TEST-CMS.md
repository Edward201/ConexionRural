# 🧪 Test del Panel CMS

## ✅ Estado Actual

Las **4 secciones YA ESTÁN CREADAS** en la base de datos:

```
1. [hero] Conexión Rural 360
2. [about] Sobre el Proyecto
3. [team] ¿Quiénes somos?
4. [contact] Contacto
```

---

## 🔍 Prueba del Panel

### **Opción 1: Desde el navegador (RECOMENDADO)**

1. **Abre el panel CMS:**
   ```
   http://localhost:5000/content
   ```

2. **Verifica que estés logueado:**
   - Si te pide login, usa: `admin` / `admin123`
   
3. **Deberías ver la tabla con las 4 secciones**

4. **Si dice "No hay contenido creado aún":**
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña "Network" (Red)
   - Refresca la página
   - Busca la petición a `/api/cms/content`
   - Mira la respuesta

---

### **Opción 2: Test Manual con archivo HTML**

1. **Abre en el navegador:**
   ```
   http://localhost:5000/test-api.html
   ```

2. **Haz clic en los botones en orden:**
   - Botón 1: "Test Auth" → Debería mostrar tu usuario (admin)
   - Botón 2: "Test CMS Content" → Debería mostrar las 4 secciones
   - Botón 3: "Test Public Content" → Debería mostrar las 4 secciones

---

## 🐛 Si aún dice "No hay contenido"

### **Paso 1: Verificar que el servidor está corriendo**
```bash
# En una nueva terminal
netstat -ano | findstr :5000
```

Deberías ver algo como:
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING
```

### **Paso 2: Verificar logs del servidor**
Busca en la consola del servidor (donde ejecutaste `npm run dev`) estos mensajes cuando abras el panel:
```
🔍 [CMS] Obteniendo contenido...
✅ [CMS] Encontradas 4 secciones
```

### **Paso 3: Verificar autenticación**
Abre la consola del navegador (F12) y ejecuta:
```javascript
fetch('/api/auth/me', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

Deberías ver:
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    ...
  }
}
```

---

## 🔧 Soluciones Rápidas

### **Problema: No estoy logueado**
```
1. Ve a http://localhost:5000/login
2. Usuario: admin
3. Password: admin123
4. Vuelve a http://localhost:5000/content
```

### **Problema: Dice que no soy admin**
```bash
# Ejecuta este comando en la terminal:
npm run db:seed

# Esto recreará el usuario admin
```

### **Problema: Las secciones no están en la DB**
```bash
# Ejecuta:
npm run db:seed-content

# Verifica:
node check-content.js
```

---

## 📸 Qué Deberías Ver

Cuando abras http://localhost:5000/content deberías ver:

```
┌─────────────────────────────────────────────────────────┐
│  Gestión de Contenido                                   │
│  Administra el contenido de la página principal         │
│                                            [+ Nueva Sección] [Volver] │
├─────────────────────────────────────────────────────────┤
│  Secciones de Contenido                                 │
│  Lista de todas las secciones de la página principal    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Orden │ Sección │ Título             │ Visible │ Acciones │ │
│  ├────────────────────────────────────────────────────┤ │
│  │   1   │ hero    │ Conexión Rural 360 │   👁️   │  ✏️  🗑️  │ │
│  │   2   │ about   │ Sobre el Proyecto  │   👁️   │  ✏️  🗑️  │ │
│  │   3   │ team    │ ¿Quiénes somos?    │   👁️   │  ✏️  🗑️  │ │
│  │   4   │ contact │ Contacto           │   👁️   │  ✏️  🗑️  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Una Vez Funcionando

**Para editar una sección:**
1. Clic en ✏️ de cualquier sección
2. Modifica los campos
3. Clic en "Guardar"
4. Ve a http://localhost:5000
5. Presiona F5
6. ✅ ¡Cambios visibles!

---

## 🆘 Si Nada Funciona

**Opción 1: Reiniciar todo**
```bash
# Detener el servidor (Ctrl+C en la terminal)
# Luego:
npm run db:seed-content
npm run dev
```

**Opción 2: Revisar el código del componente**
El archivo `client/src/pages/content-management.tsx` línea 72-82 hace la petición.

**Opción 3: Avísame qué ves**
- Captura de pantalla del panel
- Mensajes de error en la consola del navegador (F12)
- Mensajes en la terminal del servidor

---

¿Qué ves cuando abres http://localhost:5000/content ahora?


