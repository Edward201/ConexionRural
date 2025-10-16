# 📊 Guía de Analytics - Dashboard Web Metrics

## ✅ ¿Qué se ha implementado?

Un **sistema completo de analytics** con panel visual interactivo que incluye:

### 📈 Métricas Implementadas

1. **Visitas Totales** - Número total de visitas en el período
2. **Fuentes de Tráfico** - Orgánico, redes sociales, directo, referido
3. **Tiempo Promedio en Página** - Duración media de las visitas
4. **Páginas Más Visitadas** - Top 10 páginas con más tráfico
5. **Tasa de Rebote** - Porcentaje de visitas que abandonan sin interactuar
6. **Usuarios Nuevos vs Recurrentes** - Segmentación de audiencia
7. **Dispositivos Usados** - Móvil, desktop, tablet con detalles de navegador/OS
8. **Conversiones** - Registros, suscripciones y otros objetivos alcanzados

---

## 🚀 Cómo Usar

### **1. Acceder al Panel de Analytics**

1. Inicia sesión como admin: http://localhost:5000/login
   - Usuario: `admin`
   - Contraseña: `admin123`

2. En el Dashboard, haz clic en **"Ver Analytics"**
   
   O ve directamente a: http://localhost:5000/analytics

### **2. Navegar por el Panel**

El panel tiene 4 pestañas principales:

#### 📊 **Tráfico**
- Gráfico de línea con evolución temporal
- Fuentes de tráfico (orgánico, social, directo, referido)
- Distribución de usuarios nuevos vs recurrentes
- Métricas principales en tarjetas

#### 📄 **Páginas**
- Tabla con las 10 páginas más visitadas
- Número de visitas por página
- Tiempo promedio en cada página
- URLs y títulos

#### 📱 **Dispositivos**
- Gráfico circular de dispositivos (móvil/desktop/tablet)
- Lista detallada con navegador y sistema operativo
- Visitas por combinación de dispositivo

#### 🎯 **Conversiones**
- Gráfico de barras por tipo de conversión
- Tabla con cantidad y valor total
- Tipos: registros, suscripciones, contactos, descargas

### **3. Filtrar por Período**

En la esquina superior derecha, selecciona:
- **Últimos 7 días**
- **Últimos 30 días** (por defecto)
- **Últimos 90 días**

---

## 📡 API Endpoints

### **Público**
```javascript
POST /api/analytics/track
// Registrar evento de analytics
Body: {
  pageUrl: string,
  pageTitle: string,
  referrer: string,
  source: "organic" | "social" | "direct" | "referral",
  medium: string | null,
  sessionId: string,
  isNewUser: boolean,
  deviceType: "mobile" | "desktop" | "tablet",
  browser: string,
  os: string,
  timeOnPage: number, // segundos
  bounced: boolean,
  converted: boolean,
  conversionType: string | null,
  ...
}
```

### **Admin Only**
```javascript
GET /api/analytics/overview?days=30
// Resumen general de métricas

GET /api/analytics/sources?days=30
// Fuentes de tráfico

GET /api/analytics/pages?days=30
// Páginas más visitadas

GET /api/analytics/devices?days=30
// Dispositivos usados

GET /api/analytics/conversions?days=30
// Conversiones por tipo

GET /api/analytics/timeline?days=30
// Visitas por día
```

---

## 🎨 Componentes Visuales

### **Tarjetas de Métricas**
- ✅ Visitas Totales (icono: 👁️)
- ✅ Usuarios Nuevos (icono: 👥)
- ✅ Tiempo Promedio (icono: ⏱️)
- ✅ Tasa de Rebote (icono: 🖱️)
- ✅ Conversiones (icono: 🎯)
- ✅ Promedio Diario (icono: 📈)

### **Gráficos**
- **Línea** - Evolución temporal de visitas
- **Barras** - Conversiones por tipo
- **Circular (Pie)** - Dispositivos y tipos de usuario

### **Tablas**
- Páginas más visitadas
- Dispositivos con detalles
- Conversiones con valores

---

## 🧪 Datos de Demo

Ya se generaron **1,727 eventos** de demo para los últimos 30 días con:
- 6 páginas diferentes
- 4 fuentes de tráfico
- 3 tipos de dispositivos
- 4 tipos de conversiones
- Datos realistas y variados

Para regenerar datos:
```bash
npm run db:seed-analytics
```

---

## 🔄 Integración en Tu Sitio Web

### **Opción 1: Tracking Manual**

Agrega este código en cada página que quieras trackear:

```javascript
// En tu componente React o página
useEffect(() => {
  const trackPageView = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: window.location.pathname,
          pageTitle: document.title,
          referrer: document.referrer,
          source: detectSource(), // función para detectar fuente
          sessionId: getSessionId(), // obtener/crear session ID
          isNewUser: isFirstVisit(),
          deviceType: getDeviceType(),
          browser: detectBrowser(),
          os: detectOS(),
          timeOnPage: 0,
          bounced: false,
          converted: false,
        }),
      });
    } catch (error) {
      console.error('Error tracking:', error);
    }
  };

  trackPageView();
}, []);
```

### **Opción 2: Hook Personalizado**

Crea un hook `useAnalytics`:

```typescript
// hooks/use-analytics.ts
export function useAnalytics() {
  const track = useCallback(async (event: Partial<InsertAnalytics>) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          deviceType: getDeviceType(),
          browser: detectBrowser(),
          os: detectOS(),
          ...event,
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const trackPageView = useCallback((url: string, title: string) => {
    track({
      pageUrl: url,
      pageTitle: title,
      referrer: document.referrer,
      source: detectSource(),
      isNewUser: isFirstVisit(),
      bounced: false,
      converted: false,
      timeOnPage: 0,
    });
  }, [track]);

  const trackConversion = useCallback((type: string, value?: number) => {
    track({
      pageUrl: window.location.pathname,
      pageTitle: document.title,
      source: detectSource(),
      sessionId: getSessionId(),
      isNewUser: false,
      deviceType: getDeviceType(),
      bounced: false,
      converted: true,
      conversionType: type,
      conversionValue: value,
    });
  }, [track]);

  return { trackPageView, trackConversion };
}
```

Uso:
```typescript
const { trackPageView, trackConversion } = useAnalytics();

// Al cargar página
useEffect(() => {
  trackPageView(window.location.pathname, document.title);
}, []);

// Al registrarse
const handleRegister = async () => {
  await register();
  trackConversion('registration');
};
```

---

## 📊 Funciones Auxiliares Útiles

```typescript
// Detectar tipo de dispositivo
function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Detectar navegador
function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}

// Detectar OS
function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'Mac OS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
}

// Obtener/crear session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Detectar fuente de tráfico
function detectSource(): string {
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  const social = ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'];
  if (social.some(s => referrer.includes(s))) return 'social';
  
  const search = ['google', 'bing', 'yahoo', 'duckduckgo'];
  if (search.some(s => referrer.includes(s))) return 'organic';
  
  return 'referral';
}

// Verificar si es primera visita
function isFirstVisit(): boolean {
  const visited = localStorage.getItem('has_visited');
  if (!visited) {
    localStorage.setItem('has_visited', 'true');
    return true;
  }
  return false;
}
```

---

## 🎯 Trackear Conversiones

### Ejemplo: Registro de Usuario

```typescript
// En register.tsx
const handleRegister = async (data) => {
  const user = await registerUser(data);
  
  // Trackear conversión
  await fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageUrl: '/register',
      pageTitle: 'Registro',
      source: detectSource(),
      sessionId: getSessionId(),
      isNewUser: true,
      deviceType: getDeviceType(),
      bounced: false,
      converted: true,
      conversionType: 'registration',
      conversionValue: null,
    }),
  });
};
```

### Ejemplo: Suscripción

```typescript
const handleSubscribe = async (plan) => {
  await subscribe(plan);
  
  await fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageUrl: '/subscribe',
      pageTitle: 'Suscripción',
      source: detectSource(),
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      converted: true,
      conversionType: 'subscription',
      conversionValue: plan.price,
    }),
  });
};
```

---

## 📈 Métricas Clave

### **Tasa de Rebote Ideal**
- **Excelente:** < 40%
- **Buena:** 40-60%
- **Mejorable:** > 60%

### **Tiempo en Página**
- **Landing Pages:** 2-3 minutos
- **Blog Posts:** 3-5 minutos
- **Páginas de Producto:** 1-2 minutos

### **Tasa de Conversión**
- **Ecommerce:** 2-3%
- **B2B:** 5-10%
- **Landing Pages:** 10-15%

---

## 🔧 Comandos Útiles

```bash
# Ver analytics en el navegador
http://localhost:5000/analytics

# Regenerar datos de demo
npm run db:seed-analytics

# Limpiar tabla de analytics
psql -U postgres -d conexion_rural -c "TRUNCATE TABLE analytics RESTART IDENTITY;"

# Ver total de eventos registrados
psql -U postgres -d conexion_rural -c "SELECT COUNT(*) FROM analytics;"
```

---

## 🎨 Personalización

### Cambiar Colores de Gráficos

En `analytics.tsx`, modifica el array `COLORS`:

```typescript
const COLORS = [
  '#0088FE', // Azul
  '#00C49F', // Verde
  '#FFBB28', // Amarillo
  '#FF8042', // Naranja
  '#8884D8', // Morado
  '#82CA9D', // Verde claro
];
```

### Agregar Más Métricas

1. Agrega campo en `shared/schema.ts`
2. Crea endpoint en `server/routes.ts`
3. Agrega visualización en `analytics.tsx`

---

## 📚 Estructura de la Base de Datos

```sql
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  source TEXT NOT NULL,
  medium TEXT,
  campaign TEXT,
  user_id INTEGER REFERENCES users(id),
  session_id TEXT NOT NULL,
  is_new_user BOOLEAN NOT NULL DEFAULT true,
  device_type TEXT NOT NULL,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  time_on_page INTEGER DEFAULT 0,
  bounced BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT,
  conversion_value INTEGER,
  country TEXT,
  city TEXT,
  visited_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 🎉 ¡Listo!

Tu panel de analytics está completamente funcional con:
- ✅ 8 métricas principales
- ✅ 4 tipos de gráficos interactivos
- ✅ 6 endpoints API
- ✅ Datos de demo generados
- ✅ UI moderna y responsiva
- ✅ Filtros por período

**Accede ahora:** http://localhost:5000/analytics

---

**Creado:** Octubre 2025  
**Versión:** 1.0.0  
**Stack:** React + Recharts + PostgreSQL

