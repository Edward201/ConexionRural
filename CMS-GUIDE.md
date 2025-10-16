# 📝 Sistema de Gestión de Contenido (CMS)

## ✅ ¿Qué se ha implementado?

Un **sistema completo de gestión de contenido** (CMS) que permite a los administradores editar el contenido de la página principal sin tocar código.

---

## 🎯 Funcionalidades

### **1. Panel de Gestión** (`/content`)
- ✅ Crear nuevas secciones de contenido
- ✅ Editar secciones existentes
- ✅ Eliminar secciones
- ✅ Mostrar/ocultar secciones
- ✅ Ordenar secciones
- ✅ Vista previa del contenido

### **2. Campos Editables por Sección:**
- **Sección** - Identificador único (hero, about, services, etc.)
- **Título** - Título principal
- **Subtítulo** - Texto secundario
- **Descripción** - Descripción corta
- **Contenido** - Texto largo, HTML o JSON
- **URL de Imagen** - Imagen de la sección
- **Texto del Botón** - Call-to-action
- **Enlace del Botón** - URL del botón
- **Visible** - Mostrar/ocultar en la página
- **Orden** - Posición en la página

### **3. API REST Completa:**
```
GET    /api/content           - Obtener todo el contenido (público)
GET    /api/content/:section  - Obtener una sección (público)
GET    /api/cms/content       - Listar contenido (admin)
POST   /api/cms/content       - Crear sección (admin)
PUT    /api/cms/content/:id   - Actualizar sección (admin)
DELETE /api/cms/content/:id   - Eliminar sección (admin)
```

---

## 🚀 Cómo Usar

### **Acceder al Panel de Gestión**

1. Inicia sesión como admin:
   - http://localhost:5000/login
   - Usuario: `admin`
   - Contraseña: `admin123`

2. En el Dashboard, haz clic en **"Gestionar Contenido"**
   
   O ve directamente a: http://localhost:5000/content

### **Crear Nueva Sección**

1. Haz clic en **"Nueva Sección"**
2. Completa los campos:
   ```
   Sección:     products
   Título:      Nuestros Productos
   Subtítulo:   Lo mejor para tu negocio
   Descripción: Catálogo completo de productos
   Contenido:   [Texto largo o JSON con lista de productos]
   Imagen:      /assets/products.jpg
   Botón:       Ver Catálogo
   Enlace:      /catalogo
   Visible:     ✓ (activado)
   Orden:       5
   ```
3. Haz clic en **"Guardar"**

### **Editar Sección Existente**

1. En la tabla de contenido, busca la sección
2. Haz clic en el icono ✏️ (Editar)
3. Modifica los campos que necesites
4. Haz clic en **"Guardar"**

### **Ocultar/Mostrar Sección**

1. Edita la sección
2. Activa/desactiva el switch **"Visible en la página principal"**
3. Guarda los cambios
4. La sección no aparecerá en la página pública si está oculta

### **Ordenar Secciones**

1. Edita cada sección
2. Cambia el campo **"Orden"** (1, 2, 3, etc.)
3. Las secciones con número menor aparecen primero

### **Eliminar Sección**

1. Haz clic en el icono 🗑️ (Eliminar)
2. Confirma la eliminación
3. ⚠️ **Esta acción no se puede deshacer**

---

## 📊 Secciones Pre-creadas

Ya se crearon 8 secciones de ejemplo:

| Sección | Título | Orden |
|---------|--------|-------|
| **hero** | Conexión Rural 360 | 1 |
| **about** | ¿Quiénes Somos? | 2 |
| **services** | Nuestros Servicios | 3 |
| **features** | ¿Por Qué Elegirnos? | 4 |
| **testimonials** | Lo Que Dicen Nuestros Clientes | 5 |
| **stats** | Nuestro Impacto | 6 |
| **cta** | ¿Listo para Conectarte? | 7 |
| **contact** | Contáctanos | 8 |

---

## 🎨 Tipos de Contenido

### **Texto Simple**
```
Descripción: Un párrafo corto de texto
```

### **HTML**
```html
<p>Texto con <strong>formato</strong></p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### **JSON para Listas**
```json
[
  {
    "name": "Internet Rural",
    "description": "Conexión de alta velocidad",
    "icon": "wifi"
  },
  {
    "name": "Redes Comunitarias",
    "description": "Infraestructura compartida",
    "icon": "network"
  }
]
```

### **JSON para Datos Estructurados**
```json
{
  "phone": "+57 300 123 4567",
  "email": "info@ejemplo.com",
  "address": "Calle 123, Bogotá",
  "social": {
    "facebook": "usuario",
    "instagram": "@usuario"
  }
}
```

---

## 💡 Casos de Uso

### **Caso 1: Actualizar Banner Principal**

**Escenario:** Cambiar el texto del banner (hero)

**Pasos:**
1. Ve a `/content`
2. Edita la sección **"hero"**
3. Cambia:
   - Título: "Nueva Oferta Especial"
   - Subtítulo: "50% de descuento en tu primer mes"
   - Botón: "Aprovechar Oferta"
4. Guarda
5. ✅ El banner se actualizó instantáneamente

---

### **Caso 2: Agregar Nuevo Servicio**

**Escenario:** Añadir "Telefonía IP" a los servicios

**Pasos:**
1. Edita la sección **"services"**
2. En el campo "Contenido", agrega:
```json
[
  ...servicios existentes,
  {
    "name": "Telefonía IP",
    "description": "Llamadas de alta calidad por internet",
    "icon": "phone"
  }
]
```
3. Guarda
4. ✅ El nuevo servicio aparece en la página

---

### **Caso 3: Ocultar Sección Temporalmente**

**Escenario:** Ocultar testimonios mientras se actualizan

**Pasos:**
1. Edita la sección **"testimonials"**
2. Desactiva el switch "Visible"
3. Guarda
4. ✅ La sección no se muestra en la página pública
5. Los admins aún pueden verla en `/content`

---

### **Caso 4: Crear Página de Productos**

**Escenario:** Nueva sección de catálogo

**Pasos:**
1. Clic en **"Nueva Sección"**
2. Completa:
   ```
   Sección: products
   Título: Catálogo de Productos
   Contenido: [JSON con lista de productos]
   Orden: 4
   Visible: ✓
   ```
3. Guarda
4. ✅ Nueva sección creada entre "services" y "features"

---

## 📡 Uso desde Frontend

### **Obtener Todo el Contenido**

```typescript
// En tu componente React
const { data } = useQuery({
  queryKey: ["page-content"],
  queryFn: async () => {
    const response = await fetch("/api/content");
    return response.json();
  },
});

const contents = data?.contents || [];
```

### **Obtener Sección Específica**

```typescript
const { data } = useQuery({
  queryKey: ["content-hero"],
  queryFn: async () => {
    const response = await fetch("/api/content/hero");
    return response.json();
  },
});

const heroContent = data?.content;
```

### **Renderizar Contenido**

```typescript
// Hero Section
{heroContent && (
  <section className="hero">
    <h1>{heroContent.title}</h1>
    <p>{heroContent.subtitle}</p>
    <p>{heroContent.description}</p>
    {heroContent.imageUrl && (
      <img src={heroContent.imageUrl} alt={heroContent.title} />
    )}
    {heroContent.buttonText && (
      <a href={heroContent.buttonLink}>
        {heroContent.buttonText}
      </a>
    )}
  </section>
)}
```

### **Contenido con JSON**

```typescript
// Services Section
const services = heroContent?.content 
  ? JSON.parse(heroContent.content) 
  : [];

{services.map((service: any) => (
  <div key={service.name}>
    <h3>{service.name}</h3>
    <p>{service.description}</p>
  </div>
))}
```

---

## 🔐 Seguridad

### **Permisos:**
- ✅ Solo **administradores** pueden gestionar contenido
- ✅ API `/api/cms/*` requiere autenticación y rol admin
- ✅ API `/api/content` es pública (solo lectura)
- ✅ Se registra quién actualizó cada sección (`updatedBy`)

### **Validación:**
- ✅ Sección es obligatoria y única
- ✅ Campos opcionales con validación de tipo
- ✅ Sanitización en frontend y backend

---

## 🎯 Mejoras Futuras (Opcional)

### **1. Editor WYSIWYG**
Reemplazar el textarea con un editor visual:
```bash
npm install @tiptap/react @tiptap/starter-kit
```

### **2. Subida de Imágenes**
Implementar upload de imágenes en lugar de URLs:
```typescript
// Usar multer o similar
app.post("/api/upload", upload.single("image"), ...);
```

### **3. Previsualización en Tiempo Real**
Mostrar cómo se verá la sección antes de guardar:
```typescript
<PreviewPanel content={formData} />
```

### **4. Versiones y Rollback**
Guardar historial de cambios:
```sql
CREATE TABLE content_versions (
  id SERIAL PRIMARY KEY,
  content_id INT REFERENCES page_content(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Programar Publicación**
Publicar contenido en fecha/hora específica:
```typescript
publishAt: timestamp("publish_at"),
```

### **6. Múltiples Idiomas**
Contenido en diferentes idiomas:
```typescript
language: text("language").default("es"),
```

---

## 📁 Estructura de Archivos

### **✨ Nuevos:**
```
shared/schema.ts                    (actualizado - tabla page_content)
server/routes.ts                    (actualizado - 5 endpoints CMS)
server/seed-content.ts              (nuevo - datos iniciales)
client/src/pages/content-management.tsx  (nuevo - panel CMS)
client/src/App.tsx                  (actualizado - ruta /content)
client/src/pages/dashboard.tsx      (actualizado - botón CMS)
package.json                        (actualizado - script seed)
CMS-GUIDE.md                        (esta documentación)
```

---

## 🎉 Resumen

### **✅ Lo que puedes hacer ahora:**

1. **Editar contenido** sin tocar código
2. **Crear secciones** nuevas dinámicamente
3. **Mostrar/ocultar** secciones con un clic
4. **Ordenar** el contenido de la página
5. **Gestionar** todo desde un panel admin
6. **API REST** para consumir el contenido

### **🚀 Cómo Empezar:**

1. Ve a: http://localhost:5000/content
2. Explora las 8 secciones pre-creadas
3. Edita una sección (ej: hero)
4. Cambia el título
5. Guarda
6. ¡Ve el cambio reflejado!

---

## 📞 Comandos Útiles

```bash
# Crear contenido inicial
npm run db:seed-content

# Ver contenido en la base de datos
psql -U postgres -d conexion_rural -c "SELECT section, title, is_visible, order FROM page_content;"

# Limpiar contenido
psql -U postgres -d conexion_rural -c "TRUNCATE TABLE page_content RESTART IDENTITY;"

# Regenerar contenido
npm run db:seed-content
```

---

**¡Tu CMS está listo para usar!** 📝✨

**Accede ahora:** http://localhost:5000/content  
**Login:** `admin` / `admin123`

