# 🚀 Instrucciones para Aplicar las Mejoras del CMS Hero

## ⚡ Pasos Rápidos

### 1️⃣ Aplicar la Migración de Base de Datos

Ejecuta este comando en la terminal:

```bash
npm run db:migrate-hero
```

**O manualmente con PostgreSQL:**

```bash
psql -U tu_usuario -d tu_base_de_datos -f database-migration-hero-fields.sql
```

### 2️⃣ Reiniciar el Servidor

```bash
npm run dev
```

### 3️⃣ Probar las Mejoras

1. Abre el navegador en `http://localhost:5000`
2. Inicia sesión como **administrador**
3. Ve al **Dashboard**
4. Haz clic en **"Gestión de Contenido"**
5. Edita la sección **"hero"**

## ✨ ¿Qué Puedes Hacer Ahora?

### 🎥 Control del Fondo

Ahora puedes elegir entre:
- **Video de fondo**: Perfecto para contenido dinámico
- **Imagen de fondo**: Más rápido de cargar

### 🎯 Control Total de Botones

- **Botón 1**: Configura texto y enlace del botón principal
- **Botón 2**: Configura texto y enlace del botón secundario
- Ambos botones son opcionales

### 👁️ Ocultar/Mostrar Secciones

- El switch "Visible" ahora funciona correctamente
- Puedes ocultar temporalmente la sección Hero sin eliminarla

## 📸 Ejemplo de Configuración

```
Sección: hero
Título: Conexión Rural 360
Subtítulo: Educando en Contexto
Descripción: Una apuesta investigativa para fortalecer...

--- Configuración de Fondo ---
Tipo de Fondo: Video
URL del Video: /attached_assets/IMG_8988_1754364438033.MP4

--- Botones de Acción ---
Texto del Botón 1: Conocer más
Enlace del Botón 1: #proyecto

Texto del Botón 2: Ver Video
Enlace del Botón 2: #video

Visible: ✅ Activado
```

## 🔍 Verificar que Todo Funciona

1. **Guarda los cambios** en el CMS
2. **Abre la página principal** en una ventana de incógnito
3. **Verifica que**:
   - El fondo se muestra correctamente (video o imagen)
   - Los textos están actualizados
   - Los botones funcionan y llevan a donde deben
   - Si desactivas "Visible", la sección desaparece

## ❓ Solución de Problemas

### Error: "Column already exists"
✅ **Solución**: La columna ya existe, ignora el error

### Los cambios no se guardan
✅ **Solución**: Verifica que ejecutaste la migración

### La sección hero no aparece
✅ **Solución**: Verifica que el switch "Visible" esté activado

### Los botones no funcionan
✅ **Solución**: Verifica que los enlaces empiecen con `#` para secciones internas

## 📚 Documentación Completa

Lee el archivo `CMS-HERO-MEJORAS.md` para documentación detallada.

## 🎉 ¡Listo!

Ahora tienes control total sobre la sección Hero desde el CMS.

---
**Actualizado**: 26 de Octubre, 2025

