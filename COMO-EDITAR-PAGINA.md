# 📝 Cómo Editar la Página de Inicio

## ✅ **Todo Listo - Ya Puedes Editar**

Ahora tienes **4 secciones editables** en http://localhost:5000/content que corresponden a diferentes partes de tu página de inicio.

---

## 🎯 **Secciones Disponibles**

### **1. hero** - Banner Principal
**Dónde aparece:** La primera sección grande con video de fondo  
**Qué puedes editar:**
- **Título**: "Conexión Rural 360"
- **Subtítulo**: "Educando en Contexto"
- **Descripción**: El texto largo debajo del subtítulo

**Ejemplo de edición:**
```
Panel CMS → Buscar "hero" → Editar
• Título: "Conexión Rural 360 - Nueva Fase"
• Subtítulo: "Transformando la Educación Rural"
• Descripción: "Proyecto de investigación educativa..."
Guardar → Ir a http://localhost:5000 → F5
```

---

### **2. about** - Sobre el Proyecto
**Dónde aparece:** La segunda sección de la página  
**Qué puedes editar:**
- **Título**: "Sobre el Proyecto"
- **Subtítulo**: Aparece en negrita al inicio del texto
- **Descripción**: El párrafo explicativo completo
- **Contenido**: El texto del "Objetivo General" (recuadro naranja)
- **Texto del Botón**: "Objetivo General" (título del recuadro naranja)

**Ejemplo de edición:**
```
Panel CMS → Buscar "about" → Editar
• Título: "Nuestro Proyecto"
• Descripción: "Nueva descripción del proyecto..."
• Contenido: "Nuevo objetivo general..."
Guardar → Refresca la página
```

---

### **3. team** - Equipo
**Dónde aparece:** Sección "¿Quiénes somos?"  
**Qué puedes editar:**
- **Título**: "¿Quiénes somos?"
- **Subtítulo**: El texto gris debajo del título

**Ejemplo de edición:**
```
Panel CMS → Buscar "team" → Editar
• Título: "Nuestro Equipo"
• Subtítulo: "Investigadores comprometidos con la educación..."
Guardar → Refresca la página
```

---

### **4. contact** - Contacto (Footer)
**Dónde aparece:** En el pie de página (footer), sección de contacto  
**Qué puedes editar:**
- **Título**: "Contacto"
- **Subtítulo**: Nombre de la persona de contacto
- **Contenido**: Email
- **Descripción**: Institución

**Ejemplo de edición:**
```
Panel CMS → Buscar "contact" → Editar
• Subtítulo: "María Rodríguez"
• Contenido: "maria@ejemplo.com"
• Descripción: "Universidad Nacional"
Guardar → Refresca la página
```

---

## 🚀 **Pasos para Editar (2 minutos)**

### **Paso 1: Acceder al Panel**
```
1. Abre: http://localhost:5000/login
2. Usuario: admin
3. Password: admin123
4. Clic en "Gestionar Contenido"
```

### **Paso 2: Seleccionar Sección**
```
En la tabla verás 4 secciones:
├── hero     → Banner principal
├── about    → Sobre el Proyecto
├── team     → ¿Quiénes somos?
└── contact  → Footer (contacto)
```

### **Paso 3: Editar**
```
1. Clic en el ícono ✏️ de la sección
2. Modifica los campos que quieras
3. Clic en "Guardar"
```

### **Paso 4: Ver Cambios**
```
1. Ve a http://localhost:5000
2. Presiona F5 (o Ctrl + F5)
3. ✅ ¡Cambios visibles!
```

---

## 💡 **Ejemplos Prácticos**

### **Cambiar el Título Principal:**
```bash
1. http://localhost:5000/content
2. Busca "hero"
3. Editar → Campo "Título"
4. Escribe: "Conexión Rural 360 - Edición 2025"
5. Guardar
6. Refresca http://localhost:5000
✅ Nuevo título en el banner
```

### **Actualizar el Email de Contacto:**
```bash
1. http://localhost:5000/content
2. Busca "contact"
3. Editar → Campo "Contenido"
4. Escribe: "nuevoemail@ucompensar.edu.co"
5. Guardar
6. Refresca http://localhost:5000
✅ Nuevo email en el footer
```

### **Modificar la Descripción del Proyecto:**
```bash
1. http://localhost:5000/content
2. Busca "about"
3. Editar → Campo "Descripción"
4. Escribe tu nueva descripción
5. Guardar
6. Refresca http://localhost:5000
✅ Nueva descripción visible
```

---

## 📍 **Mapeo Exacto: Campo CMS → Página**

### **Sección "hero":**
```
title       →  Título grande del banner
subtitle    →  Subtítulo debajo del título
description →  Párrafo largo explicativo
```

### **Sección "about":**
```
title       →  "Sobre el Proyecto"
subtitle    →  Texto en negrita al inicio
description →  Párrafo completo de descripción
content     →  Texto dentro del recuadro naranja
buttonText  →  Título del recuadro naranja
```

### **Sección "team":**
```
title       →  "¿Quiénes somos?"
subtitle    →  Texto gris descriptivo
```

### **Sección "contact":**
```
title       →  "Contacto"
subtitle    →  Nombre de la persona
content     →  Email
description →  Institución
```

---

## 🔗 **Enlaces Rápidos**

```
🏠 Página Inicio:    http://localhost:5000
✏️ Panel CMS:        http://localhost:5000/content
🔐 Login:            http://localhost:5000/login
📊 Dashboard:        http://localhost:5000/dashboard
```

**Credenciales:**
- Usuario: `admin`
- Password: `admin123`

---

## ⚠️ **Importante**

### **Lo que SÍ puedes editar:**
- ✅ Títulos y subtítulos
- ✅ Descripciones y textos
- ✅ Email de contacto
- ✅ Nombre de la persona de contacto

### **Lo que NO está editable (por ahora):**
- ❌ Imágenes de la galería (están hardcodeadas)
- ❌ Nombres de las instituciones participantes
- ❌ Datos de las escuelas (El Volcán, San Andrés)
- ❌ Fases del proyecto (CONECTAR, CONSTRUIR, MAPEO)
- ❌ Materiales descargables
- ❌ Navegación del menú

**Si necesitas editar estas secciones también, podemos agregarlas al CMS.**

---

## 🆘 **Problemas Comunes**

### **No veo las secciones en el panel:**
```bash
# Ejecuta nuevamente el seed:
npm run db:seed-content
```

### **Los cambios no se ven:**
```bash
# Refresca con Ctrl + F5
# O abre en ventana privada/incógnito
```

### **Error al guardar:**
```bash
# Verifica que estés logueado como "admin"
# Intenta cerrar sesión y volver a entrar
```

---

## 📚 **Más Ayuda**

- **INSTRUCCIONES-RAPIDAS.md** → Guía express
- **CMS-HOME-GUIDE.md** → Guía completa detallada
- **CMS-GUIDE.md** → Documentación del sistema CMS

---

## 🎉 **¡Empieza Ahora!**

```bash
1. Ve a: http://localhost:5000/content
2. Login: admin / admin123
3. Verás 4 secciones editables
4. Edita cualquiera
5. Guarda
6. Refresca http://localhost:5000
7. ✅ ¡Listo!
```

---

**¿Todo claro? ¡Adelante y edita tu página! 🚀**

