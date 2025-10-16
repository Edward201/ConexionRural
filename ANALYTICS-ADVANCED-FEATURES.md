# 🚀 Analytics - Funcionalidades Avanzadas

## ✅ Implementado

### 1️⃣ **Tracking Automático en Todas las Páginas**

#### 📁 Archivos Creados:
- `client/src/lib/analytics.ts` - Librería completa de tracking
- `client/src/hooks/use-analytics.ts` - Hook de React para tracking

#### 🎯 Funcionalidades:
- ✅ **Tracking automático** de cada cambio de ruta
- ✅ **Detección automática** de:
  - Tipo de dispositivo (móvil/desktop/tablet)
  - Navegador (Chrome, Firefox, Safari, Edge, etc.)
  - Sistema operativo (Windows, Mac, Linux, Android, iOS)
  - Resolución de pantalla
  - Fuente de tráfico (orgánico, social, directo, referido)
  - Medium específico (Google, Facebook, Twitter, etc.)
- ✅ **Tracking de tiempo en página** automático
- ✅ **Detección de rebote** (< 10 segundos)
- ✅ **Session ID** persistente
- ✅ **First visit tracking**

#### 📊 Cómo Funciona:

1. **Automático en cada página:**
```typescript
// En App.tsx - se ejecuta automáticamente
function Router() {
  useAnalytics(); // ← Esto trackea todo automáticamente
  return <Switch>...</Switch>;
}
```

2. **Se captura automáticamente:**
   - Cada cambio de URL
   - Tiempo que el usuario pasa en cada página
   - Cuando el usuario abandona la página
   - Cuando cambia de pestaña

3. **Trackear conversiones manualmente:**
```typescript
import { trackConversion } from "@/lib/analytics";

// En cualquier lugar de tu app
await trackConversion("registration");
await trackConversion("subscription", 29.99);
await trackConversion("contact");
```

#### 🔧 Ejemplo en la Página de Registro:

```typescript
// client/src/pages/register.tsx
import { trackConversion } from "@/lib/analytics";

const registerMutation = useMutation({
  onSuccess: () => {
    trackConversion("registration"); // ← Automático
    setLocation("/login");
  },
});
```

---

### 2️⃣ **Filtros Avanzados**

#### 🎯 Filtros Disponibles:

1. **Fuente de Tráfico:**
   - Todas las fuentes
   - Orgánico (Google, Bing, etc.)
   - Redes Sociales (Facebook, Twitter, etc.)
   - Directo
   - Referido

2. **Tipo de Dispositivo:**
   - Todos los dispositivos
   - Desktop
   - Móvil
   - Tablet

3. **Página Específica:**
   - Filtrar por URL (ej: `/about`, `/products`)
   - Búsqueda por texto

4. **Período de Tiempo:**
   - Últimos 7 días
   - Últimos 30 días
   - Últimos 90 días

#### 🔍 Cómo Usar los Filtros:

1. **Accede al panel:** http://localhost:5000/analytics

2. **En la tarjeta "Filtros Avanzados":**
   - Selecciona el período
   - Elige la fuente de tráfico
   - Selecciona el tipo de dispositivo
   - Escribe la URL de la página (opcional)

3. **Los datos se actualizan automáticamente** en:
   - Todas las métricas principales
   - Gráficos
   - Tablas
   - Timeline

4. **Limpiar filtros:**
   - Haz clic en el botón ❌ al lado del campo de página
   - O cambia cada filtro a "Todos"

#### 📊 Ejemplos de Uso:

**Ver solo tráfico móvil de Facebook:**
```
Período: 30 días
Fuente: Redes Sociales
Dispositivo: Móvil
Página: (vacío)
```

**Ver visitas a la página de productos desde Google:**
```
Período: 7 días
Fuente: Orgánico
Dispositivo: Todos
Página: /products
```

---

### 3️⃣ **Comparación de Períodos**

#### 🎯 Funcionalidad:

Compara las métricas actuales con el período anterior equivalente:
- Últimos 7 días → vs 7 días anteriores
- Últimos 30 días → vs 30 días anteriores
- Últimos 90 días → vs 90 días anteriores

#### 📊 Qué se Compara:

✅ **Todas las métricas principales:**
1. Visitas Totales
2. Usuarios Nuevos
3. Tiempo Promedio en Página
4. Tasa de Rebote
5. Conversiones
6. Promedio Diario

#### 🎨 Indicadores Visuales:

- **🟢 Flecha Verde ↑** - Incremento positivo
- **🔴 Flecha Roja ↓** - Decremento
- **Porcentaje** - Cambio exacto (ej: +24.5%, -12.3%)
- **Texto** - "vs período anterior"

#### 🔍 Cómo Usar:

1. **Activar comparación:**
   - Haz clic en el botón **"Comparar Períodos"** (esquina superior derecha)
   - El botón cambiará a **"Comparando"**

2. **Ver cambios:**
   - Cada tarjeta mostrará la variación porcentual
   - Verde = mejoró
   - Rojo = empeoró

3. **Desactivar:**
   - Haz clic de nuevo en **"Comparando"**

#### 📈 Ejemplo de Visualización:

```
┌─────────────────────────────┐
│ 👁️ Visitas Totales          │
│                             │
│ 1,234                       │
│ ↑ 24.5% vs período anterior │
│ En los últimos 30 días      │
└─────────────────────────────┘
```

---

## 🎯 Casos de Uso

### **Caso 1: Analizar Campaña de Facebook**

**Objetivo:** Ver el impacto de una campaña en Facebook

**Pasos:**
1. Filtrar por:
   - Fuente: Redes Sociales
   - Dispositivo: Móvil (la mayoría viene de móvil)
   - Período: 7 días
2. Activar comparación para ver el cambio
3. Ver páginas más visitadas desde Facebook
4. Revisar tasa de conversión

**Resultado:** Sabrás si la campaña está funcionando

---

### **Caso 2: Optimizar para Móviles**

**Objetivo:** Mejorar la experiencia móvil

**Pasos:**
1. Filtrar por:
   - Dispositivo: Móvil
   - Período: 30 días
2. Ver:
   - Tasa de rebote (¿es alta?)
   - Tiempo promedio (¿es bajo?)
   - Páginas más visitadas
3. Compara con desktop para ver diferencias

**Resultado:** Identificas problemas en móvil

---

### **Caso 3: Medir Éxito de Contenido**

**Objetivo:** Ver qué páginas convierten mejor

**Pasos:**
1. Ve a la pestaña "Páginas"
2. Ordena por visitas
3. Luego ve a "Conversiones"
4. Cruza información: ¿qué páginas generan más conversiones?

**Resultado:** Sabes qué contenido funciona

---

### **Caso 4: Comparar Rendimiento Mensual**

**Objetivo:** Ver si estás creciendo

**Pasos:**
1. Selecciona "Últimos 30 días"
2. Activa "Comparar Períodos"
3. Revisa todas las métricas
4. Identifica qué mejoró y qué empeoró

**Resultado:** Insights para tomar decisiones

---

## 📊 Métricas Clave a Monitorear

### 🎯 **Objetivos Ideales:**

| Métrica | Excelente | Buena | Mejorable |
|---------|-----------|-------|-----------|
| **Tasa de Rebote** | < 40% | 40-60% | > 60% |
| **Tiempo en Página** | > 3 min | 1-3 min | < 1 min |
| **Tasa de Conversión** | > 10% | 5-10% | < 5% |
| **Usuarios Nuevos** | 40-60% | 30-40% | < 30% |

---

## 🔧 Funciones de la Librería

### Detectar Información del Usuario:

```typescript
import {
  getDeviceType,
  detectBrowser,
  detectOS,
  detectSource,
  detectMedium,
  getSessionId,
  isFirstVisit,
  getScreenResolution,
} from "@/lib/analytics";

// Ejemplos de uso:
const device = getDeviceType(); // "mobile" | "desktop" | "tablet"
const browser = detectBrowser(); // "Chrome", "Firefox", etc.
const os = detectOS(); // "Windows", "Mac OS", etc.
const source = detectSource(); // "organic", "social", "direct", "referral"
const medium = detectMedium(); // "google", "facebook", etc.
const sessionId = getSessionId(); // "session_1234567890_abc123"
const isNew = isFirstVisit(); // true | false
const resolution = getScreenResolution(); // "1920x1080"
```

### Trackear Eventos:

```typescript
import {
  trackPageView,
  trackConversion,
  trackTimeOnPage,
  startTrackingTime,
} from "@/lib/analytics";

// Trackear vista de página
await trackPageView("/products", "Productos");

// Trackear conversión
await trackConversion("registration");
await trackConversion("purchase", 99.99);

// Trackear tiempo manualmente
startTrackingTime();
// ... usuario navega ...
await trackTimeOnPage();
```

---

## 🎨 Personalización

### Cambiar Umbral de Rebote:

En `client/src/lib/analytics.ts`, línea ~200:

```typescript
// Actual: 10 segundos
const bounced = timeOnPage < 10;

// Cambiar a 5 segundos:
const bounced = timeOnPage < 5;
```

### Agregar Nuevas Fuentes:

En `client/src/lib/analytics.ts`, función `detectSource`:

```typescript
const social = [
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "instagram.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com", // ← Agregar nueva
];
```

---

## 📱 Tracking en Producción

### Mejoras Recomendadas:

1. **Geolocalización Real:**
```typescript
// Usar API como ipapi.co
async function getLocation() {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  return {
    country: data.country_name,
    city: data.city,
  };
}
```

2. **User ID Tracking:**
```typescript
// Asociar eventos con usuarios logueados
const event = {
  ...basicEvent,
  userId: currentUser?.id, // Agregar user ID si está logueado
};
```

3. **Campaign Tracking:**
```typescript
// Detectar parámetros UTM
const urlParams = new URLSearchParams(window.location.search);
const campaign = urlParams.get('utm_campaign');
const source = urlParams.get('utm_source');
const medium = urlParams.get('utm_medium');
```

---

## 🎉 Resumen de Nuevas Funcionalidades

### ✅ **Tracking Automático**
- ✅ Se trackea cada página automáticamente
- ✅ Detecta dispositivo, navegador, OS automáticamente
- ✅ Calcula tiempo en página automáticamente
- ✅ Detecta rebotes automáticamente

### ✅ **Filtros Avanzados**
- ✅ Filtrar por fuente de tráfico
- ✅ Filtrar por tipo de dispositivo
- ✅ Filtrar por página específica
- ✅ Combinar múltiples filtros

### ✅ **Comparación de Períodos**
- ✅ Comparar con período anterior equivalente
- ✅ Ver cambios porcentuales
- ✅ Indicadores visuales (↑↓)
- ✅ Activar/desactivar con un clic

---

## 📁 Archivos Creados/Modificados

### ✨ Nuevos:
- `client/src/lib/analytics.ts` - Librería de tracking
- `client/src/hooks/use-analytics.ts` - Hook de React
- `client/src/pages/analytics-enhanced.tsx` - Panel mejorado
- `ANALYTICS-ADVANCED-FEATURES.md` - Esta documentación

### 🔄 Modificados:
- `client/src/App.tsx` - Integración del hook
- `client/src/pages/register.tsx` - Tracking de conversiones
- `server/routes.ts` - Soporte de filtros en API

---

**¡Todo listo para usar!** 🚀

Accede a: **http://localhost:5000/analytics**

Login: `admin` / `admin123`

