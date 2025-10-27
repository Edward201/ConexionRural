# Mejoras del CMS - Sección Hero

## 🎉 Cambios Implementados

Se han realizado mejoras significativas en el CMS para la gestión completa de la sección Hero de la página principal.

## 📋 Nuevas Funcionalidades

### 1. **Control de Fondo (Video o Imagen)**
- Ahora puedes elegir entre usar un video o una imagen como fondo del Hero
- Selector de tipo de fondo: "Video" o "Imagen"
- Campo específico para URL de video
- Campo específico para URL de imagen de fondo

### 2. **Doble Botón de Acción**
- Control completo del **Botón 1**: texto y enlace
- Control completo del **Botón 2**: texto y enlace
- Los enlaces pueden ser:
  - Enlaces internos (con `#seccion`)
  - URLs externas
  - Acción especial `#video` para el reproductor

### 3. **Función de Ocultar/Mostrar**
- Se corrigió el bug que impedía ocultar secciones
- Ahora el switch "Visible en la página principal" funciona correctamente
- Las secciones ocultas no aparecen en la página pública

## 🛠️ Instalación

### Paso 1: Ejecutar la Migración de Base de Datos

Debes ejecutar el script SQL para agregar los nuevos campos a la base de datos:

```bash
# Si usas PostgreSQL directamente:
psql -U tu_usuario -d tu_base_de_datos -f database-migration-hero-fields.sql

# O desde la terminal de PostgreSQL:
\i database-migration-hero-fields.sql
```

**Importante**: Este script agregará automáticamente:
- `video_url` - URL del video de fondo
- `background_type` - Tipo de fondo (video/image)
- `button2_text` - Texto del segundo botón
- `button2_link` - Enlace del segundo botón

### Paso 2: Reiniciar el Servidor

```bash
npm run dev
```

## 📖 Cómo Usar

### Editar la Sección Hero

1. **Accede al Dashboard** como administrador
2. **Ve a "Gestión de Contenido"**
3. **Busca la sección "hero"** en la tabla
4. **Haz clic en el botón de editar** (ícono de lápiz)

### Configurar el Fondo

En el formulario de edición verás una sección especial para el Hero:

#### **Si eliges "Video":**
```
Tipo de Fondo: Video
URL del Video: /attached_assets/IMG_8988_1754364438033.MP4
```

#### **Si eliges "Imagen":**
```
Tipo de Fondo: Imagen
URL de Imagen: https://ejemplo.com/imagen-fondo.jpg
```

### Configurar los Botones

#### **Botón 1** (Principal - Fondo blanco):
```
Texto del Botón 1: Conocer más
Enlace del Botón 1: #proyecto
```

#### **Botón 2** (Secundario - Borde blanco):
```
Texto del Botón 2: Ver Video
Enlace del Botón 2: #video
```

### Tipos de Enlaces

- **Enlaces a secciones**: Usa `#` seguido del ID de la sección
  - Ejemplo: `#proyecto`, `#equipo`, `#fases`, `#galeria`
  
- **Enlaces externos**: Usa la URL completa
  - Ejemplo: `https://ejemplo.com`
  
- **Acción especial de video**: Usa `#video`
  - Esto activará el reproductor de video

### Ocultar/Mostrar la Sección

En la parte inferior del formulario:
- ✅ **Switch activado** = La sección será visible en la página pública
- ❌ **Switch desactivado** = La sección estará oculta

## 🎨 Campos Disponibles en Hero

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Título** | Título principal | "Conexión Rural 360" |
| **Subtítulo** | Texto secundario | "Educando en Contexto" |
| **Descripción** | Párrafo descriptivo | "Una apuesta investigativa..." |
| **Tipo de Fondo** | Video o Imagen | "video" o "image" |
| **URL Video** | Ruta del video | "/attached_assets/video.mp4" |
| **URL Imagen** | URL de imagen | "https://ejemplo.com/bg.jpg" |
| **Texto Botón 1** | Texto del primer botón | "Conocer más" |
| **Enlace Botón 1** | Enlace del primer botón | "#proyecto" |
| **Texto Botón 2** | Texto del segundo botón | "Ver Video" |
| **Enlace Botón 2** | Enlace del segundo botón | "#video" |
| **Visible** | Mostrar/Ocultar | true/false |
| **Orden** | Orden de aparición | 0 |

## 🔧 Archivos Modificados

### Backend
- ✅ `shared/schema.ts` - Agregados nuevos campos al schema
- ✅ `server/routes.ts` - Actualizado endpoint PUT para incluir nuevos campos
- ✅ `database-migration-hero-fields.sql` - Script de migración SQL

### Frontend
- ✅ `client/src/pages/content-management.tsx` - Formulario mejorado con nuevos campos
- ✅ `client/src/pages/home.tsx` - Sección Hero usando datos del CMS

## 🐛 Bugs Corregidos

1. ✅ **Función de ocultar secciones**: Ahora funciona correctamente
2. ✅ **Backend no guardaba cambios**: Endpoint actualizado con todos los campos
3. ✅ **Fondo hardcoded**: Ahora es configurable desde el CMS
4. ✅ **Botones hardcoded**: Ambos botones son configurables

## 🚀 Próximas Mejoras Sugeridas

- [ ] Subida de imágenes directa (sin usar URLs)
- [ ] Subida de videos directa
- [ ] Vista previa en tiempo real de los cambios
- [ ] Gestión de múltiples botones (más de 2)
- [ ] Editor WYSIWYG para descripciones
- [ ] Historial de cambios

## 💡 Consejos

1. **Videos**: Usa videos en formato MP4 optimizados para web (< 10MB)
2. **Imágenes**: Usa imágenes de alta calidad pero comprimidas (formato WebP recomendado)
3. **Enlaces**: Prueba siempre los enlaces después de guardar
4. **Textos**: Mantén los textos cortos y claros para mejor experiencia móvil

## ❓ Soporte

Si encuentras algún problema o tienes sugerencias, contacta al equipo de desarrollo.

---
**Última actualización**: 26 de Octubre, 2025

