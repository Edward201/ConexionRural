# 🏠 Guía: Editar la Página de Inicio con el CMS

## 📋 **Resumen**

La página de inicio (http://localhost:5000) ahora carga su contenido **dinámicamente** desde la base de datos usando el sistema CMS. Puedes editar los textos, títulos y descripciones desde el panel de administración **sin tocar el código**.

---

## 🎯 **Cómo Funciona**

### **Antes (Estático):**
- Los textos estaban hardcodeados en `client/src/pages/home.tsx`
- Había que editar el código para cambiar cualquier texto
- Requería conocimientos de programación

### **Ahora (Dinámico con CMS):**
- ✅ Los textos se cargan desde la base de datos
- ✅ Se editan desde el panel `/content` en el dashboard
- ✅ Los cambios son **instantáneos** (solo refrescar la página)
- ✅ No requiere tocar el código

---

## 🚀 **Cómo Editar la Página de Inicio**

### **Paso 1: Acceder al Panel CMS**
1. Ve a http://localhost:5000/login
2. Inicia sesión con:
   - Usuario: `admin`
   - Password: `admin123`
3. En el Dashboard, clic en **"Gestionar Contenido"**
4. O directo a: http://localhost:5000/content

### **Paso 2: Ver las Secciones Disponibles**
Verás una tabla con todas las secciones de la página de inicio:

| Sección | Título | Visible | Descripción |
|---------|--------|---------|-------------|
| **hero** | Banner principal (arriba) | ✓ | Título, subtítulo y descripción inicial |
| **about** | Sobre el Proyecto | ✓ | Descripción del proyecto e información |
| **team** | ¿Quiénes somos? | ✓ | Subtítulo de la sección del equipo |
| **contact** | Contacto (footer) | ✓ | Información de contacto |
| services | Servicios | ✓ | (No se usa en la página actual) |
| features | Características | ✓ | (No se usa en la página actual) |
| testimonials | Testimonios | ✓ | (No se usa en la página actual) |
| stats | Estadísticas | ✓ | (No se usa en la página actual) |
| cta | Call to Action | ✓ | (No se usa en la página actual) |

---

## ✏️ **Editar Secciones Específicas**

### **🎨 Banner Principal (hero)**

**¿Qué se muestra?**
- Título principal de la página
- Subtítulo
- Descripción larga

**Cómo editar:**
1. Busca la sección **"hero"** en la tabla
2. Clic en el ícono ✏️ (Editar)
3. Modifica los campos:
   - **Título**: El título grande (ej. "Conexión Rural 360")
   - **Subtítulo**: Texto secundario (ej. "Educando en Contexto")
   - **Descripción**: Texto largo explicativo
4. Clic en **"Guardar"**
5. Refresca http://localhost:5000 para ver los cambios

**Ejemplo:**
```
✏️ Sección: hero
📝 Título: "Conexión Rural 360 - Nueva Edición"
📝 Subtítulo: "Transformando la Educación Rural"
📝 Descripción: "Un proyecto innovador que..."
```

---

### **📖 Sobre el Proyecto (about)**

**¿Qué se muestra?**
- Título de la sección "Sobre el Proyecto"
- Subtítulo con el nombre del proyecto
- Descripción del proyecto
- Objetivo general (se usa el campo "content")

**Cómo editar:**
1. Busca la sección **"about"** en la tabla
2. Clic en el ícono ✏️ (Editar)
3. Modifica:
   - **Título**: "Sobre el Proyecto" (o el que quieras)
   - **Subtítulo**: Nombre del proyecto en negrita
   - **Descripción**: Texto explicativo largo
   - **Contenido**: El objetivo general (aparece en el recuadro naranja)
   - **Texto del Botón**: "Objetivo General" (título del recuadro)
4. Clic en **"Guardar"**

**Ejemplo de uso:**
- **Título**: "Nuestro Proyecto"
- **Subtítulo**: "Investigación Educativa 2025"
- **Descripción**: "Este proyecto busca..."
- **Contenido**: "El objetivo es mejorar..."
- **Texto del Botón**: "Nuestro Objetivo"

---

### **👥 Equipo (team)**

**¿Qué se muestra?**
- Título de la sección
- Subtítulo (descripción del equipo)

**Cómo editar:**
1. Busca la sección **"team"** en la tabla
2. Clic en el ícono ✏️ (Editar)
3. Modifica:
   - **Título**: "¿Quiénes somos?"
   - **Subtítulo**: Descripción corta del equipo
4. Clic en **"Guardar"**

**Ejemplo:**
```
✏️ Sección: team
📝 Título: "Nuestro Equipo"
📝 Subtítulo: "Profesionales comprometidos con la educación rural"
```

---

### **📧 Contacto (contact)**

**¿Qué se muestra?** (En el footer)
- Título: "Contacto"
- Subtítulo: Nombre de la persona de contacto
- Contenido: Email
- Descripción: Institución

**Cómo editar:**
1. Busca la sección **"contact"** en la tabla
2. Clic en el ícono ✏️ (Editar)
3. Modifica:
   - **Título**: "Contacto" (o "Contáctanos")
   - **Subtítulo**: Nombre de la persona (ej. "Teresila Barona Villamizar")
   - **Contenido**: Email (ej. "ltbarona@ucompensar.edu.co")
   - **Descripción**: Institución (ej. "Universidad Compensar")
4. Clic en **"Guardar"**

**Ejemplo:**
```
✏️ Sección: contact
📝 Título: "¿Dudas?"
📝 Subtítulo: "Dr. Juan Pérez"
📝 Contenido: "juan.perez@ejemplo.com"
📝 Descripción: "Universidad Nacional"
```

---

## 🎭 **Mostrar/Ocultar Secciones**

### **Ocultar temporalmente una sección:**
1. Busca la sección en la tabla
2. Clic en el ícono ✏️ (Editar)
3. Desactiva el switch **"Visible"**
4. Clic en **"Guardar"**

**Resultado:** La sección se ocultará de la página de inicio, pero los datos se mantienen en la base de datos.

### **Mostrar nuevamente:**
1. Edita la sección
2. Activa el switch **"Visible"**
3. Guardar

---

## 💡 **Casos de Uso Comunes**

### **🔄 Cambiar el título principal**
```
1. Panel CMS → Buscar "hero"
2. Editar → Cambiar "Título"
3. Guardar
4. Refrescar http://localhost:5000
✅ Nuevo título visible
```

### **📝 Actualizar la descripción del proyecto**
```
1. Panel CMS → Buscar "about"
2. Editar → Cambiar "Descripción"
3. Guardar
✅ Nueva descripción en la sección "Sobre el Proyecto"
```

### **✉️ Cambiar el email de contacto**
```
1. Panel CMS → Buscar "contact"
2. Editar → Cambiar "Contenido"
3. Guardar
✅ Nuevo email en el footer
```

### **🎯 Modificar el objetivo del proyecto**
```
1. Panel CMS → Buscar "about"
2. Editar → Cambiar "Contenido"
3. Guardar
✅ Nuevo objetivo en el recuadro naranja
```

---

## 📸 **Vista Previa de Cambios**

### **Ver cambios en tiempo real:**
1. Abre dos ventanas del navegador:
   - Ventana 1: http://localhost:5000/content (Panel CMS)
   - Ventana 2: http://localhost:5000 (Página de inicio)
2. Edita en la Ventana 1
3. Guarda los cambios
4. Refresca la Ventana 2
5. ✅ ¡Cambios visibles!

---

## ⚙️ **Configuración Avanzada**

### **Agregar una nueva sección personalizada:**
1. En el Panel CMS, clic en **"Nueva Sección"**
2. Completa:
   - **Sección**: `mi_seccion` (nombre único, sin espacios)
   - **Título**: "Mi Nueva Sección"
   - **Subtítulo**: "Descripción corta"
   - **Descripción**: Texto largo
   - **Visible**: ✓
   - **Orden**: 10
3. Guardar

**Nota:** Para que la nueva sección aparezca en la página, un desarrollador deberá agregar el código correspondiente en `client/src/pages/home.tsx`.

---

## 🔒 **Seguridad**

- ✅ Solo usuarios con rol **"admin"** pueden acceder al Panel CMS
- ✅ Todos los cambios quedan registrados con el ID del usuario que los hizo
- ✅ Se validan los campos antes de guardar
- ✅ Los datos se sanitizan automáticamente

---

## 📊 **Secciones Activas vs Inactivas**

### **Secciones que SÍ se usan en la página actual:**
- ✅ **hero** → Banner principal
- ✅ **about** → Sobre el Proyecto
- ✅ **team** → Título de "¿Quiénes somos?"
- ✅ **contact** → Información de contacto (footer)

### **Secciones que NO se usan (pero están disponibles):**
- ⚠️ **services** → No implementada en la página actual
- ⚠️ **features** → No implementada en la página actual
- ⚠️ **testimonials** → No implementada en la página actual
- ⚠️ **stats** → No implementada en la página actual
- ⚠️ **cta** → No implementada en la página actual

**Puedes editarlas y estarán listas si en el futuro se agregan al diseño de la página.**

---

## 🛠️ **Solución de Problemas**

### **Los cambios no se ven reflejados:**
1. ✅ Refresca la página con `Ctrl + F5` (hard refresh)
2. ✅ Verifica que la sección esté marcada como "Visible"
3. ✅ Revisa que el campo editado sea el correcto

### **No puedo acceder al Panel CMS:**
- ✅ Verifica que estés logueado
- ✅ Asegúrate de que tu usuario sea "admin"
- ✅ Si no, crea un usuario admin con `npm run db:seed`

### **Error al guardar:**
- ✅ Verifica que el nombre de "Sección" sea único
- ✅ No uses caracteres especiales en "Sección"
- ✅ Completa al menos el campo "Sección" y "Título"

---

## 📚 **Campos del Formulario CMS**

| Campo | Descripción | Requerido | Ejemplo |
|-------|-------------|-----------|---------|
| **Sección** | Nombre único identificador (sin espacios) | ✅ | `hero`, `about` |
| **Título** | Título principal de la sección | ❌ | "Conexión Rural 360" |
| **Subtítulo** | Texto secundario | ❌ | "Educando en Contexto" |
| **Descripción** | Texto explicativo largo | ❌ | "Una apuesta investigativa..." |
| **Contenido** | Campo flexible (texto, JSON) | ❌ | "Objetivo del proyecto..." |
| **URL de Imagen** | Ruta a imagen (opcional) | ❌ | `/assets/hero.jpg` |
| **Texto del Botón** | Etiqueta de botón/título | ❌ | "Conocer más" |
| **Enlace del Botón** | URL de destino | ❌ | `/about` |
| **Visible** | Mostrar/ocultar sección | ✅ | ✓ (activo) |
| **Orden** | Posición de la sección | ❌ | 1, 2, 3... |

---

## ✅ **Checklist de Edición**

**Antes de publicar cambios:**
- [ ] He revisado la ortografía y gramática
- [ ] Los textos son claros y concisos
- [ ] He verificado que la sección esté "Visible"
- [ ] He guardado los cambios
- [ ] He refrescado la página para verificar
- [ ] Los cambios se ven correctos en la página

---

## 🎉 **¡Listo!**

Ahora puedes editar la página de inicio sin tocar el código. Cualquier cambio que hagas en el Panel CMS se reflejará automáticamente en http://localhost:5000.

**Rutas importantes:**
- 🏠 Página de inicio: http://localhost:5000
- ✏️ Panel CMS: http://localhost:5000/content
- 🔐 Login: http://localhost:5000/login
- 📊 Dashboard: http://localhost:5000/dashboard

**Credenciales de prueba:**
- Usuario: `admin`
- Password: `admin123`

---

**¿Dudas?** Consulta el archivo `CMS-GUIDE.md` para más información sobre el sistema CMS completo.

