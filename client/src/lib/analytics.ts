/**
 * Librería de Analytics
 * Funciones para detectar dispositivos, navegadores, fuentes de tráfico, etc.
 */

export interface AnalyticsEvent {
  pageUrl: string;
  pageTitle: string;
  referrer: string | null;
  source: string;
  medium: string | null;
  sessionId: string;
  isNewUser: boolean;
  deviceType: "mobile" | "desktop" | "tablet";
  browser: string;
  os: string;
  screenResolution: string;
  timeOnPage?: number;
  bounced?: boolean;
  converted?: boolean;
  conversionType?: string;
  conversionValue?: number;
}

// Detectar tipo de dispositivo
export function getDeviceType(): "mobile" | "desktop" | "tablet" {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

// Detectar navegador
export function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown";
}

// Detectar sistema operativo
export function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "Mac OS";
  if (ua.includes("X11") || ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
}

// Obtener o crear session ID
export function getSessionId(): string {
  const storageKey = "analytics_session_id";
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

// Detectar fuente de tráfico
export function detectSource(): string {
  const referrer = document.referrer.toLowerCase();
  
  if (!referrer || referrer.includes(window.location.hostname)) {
    return "direct";
  }
  
  const social = ["facebook.com", "twitter.com", "linkedin.com", "instagram.com", "tiktok.com", "youtube.com", "pinterest.com"];
  if (social.some(s => referrer.includes(s))) {
    return "social";
  }
  
  const search = ["google.com", "bing.com", "yahoo.com", "duckduckgo.com", "baidu.com"];
  if (search.some(s => referrer.includes(s))) {
    return "organic";
  }
  
  return "referral";
}

// Detectar medium (red social específica o motor de búsqueda)
export function detectMedium(): string | null {
  const referrer = document.referrer.toLowerCase();
  
  if (!referrer) return null;
  
  if (referrer.includes("facebook.com")) return "facebook";
  if (referrer.includes("twitter.com") || referrer.includes("t.co")) return "twitter";
  if (referrer.includes("linkedin.com")) return "linkedin";
  if (referrer.includes("instagram.com")) return "instagram";
  if (referrer.includes("tiktok.com")) return "tiktok";
  if (referrer.includes("youtube.com")) return "youtube";
  if (referrer.includes("google.com")) return "google";
  if (referrer.includes("bing.com")) return "bing";
  if (referrer.includes("yahoo.com")) return "yahoo";
  
  return null;
}

// Verificar si es primera visita
export function isFirstVisit(): boolean {
  const storageKey = "has_visited";
  const visited = localStorage.getItem(storageKey);
  
  if (!visited) {
    localStorage.setItem(storageKey, "true");
    localStorage.setItem("first_visit_date", new Date().toISOString());
    return true;
  }
  
  return false;
}

// Obtener resolución de pantalla
export function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

// Obtener datos de geolocalización (simplificado, usar API en producción)
export async function getLocation(): Promise<{ country: string; city: string } | null> {
  try {
    // En producción, usar una API como ipapi.co o geoip
    return { country: "Colombia", city: "Bogotá" };
  } catch (error) {
    return null;
  }
}

// Trackear evento de página vista
export async function trackPageView(url: string, title: string): Promise<void> {
  try {
    const location = await getLocation();
    
    const event: AnalyticsEvent = {
      pageUrl: url,
      pageTitle: title,
      referrer: document.referrer || null,
      source: detectSource(),
      medium: detectMedium(),
      sessionId: getSessionId(),
      isNewUser: isFirstVisit(),
      deviceType: getDeviceType(),
      browser: detectBrowser(),
      os: detectOS(),
      screenResolution: getScreenResolution(),
      timeOnPage: 0,
      bounced: false,
      converted: false,
    };

    if (location) {
      Object.assign(event, location);
    }

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true, // Asegura que se envíe incluso si el usuario cierra la página
    });
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
}

// Trackear conversión
export async function trackConversion(
  type: string,
  value?: number
): Promise<void> {
  try {
    const event: Partial<AnalyticsEvent> = {
      pageUrl: window.location.pathname,
      pageTitle: document.title,
      referrer: document.referrer || null,
      source: detectSource(),
      medium: detectMedium(),
      sessionId: getSessionId(),
      isNewUser: false,
      deviceType: getDeviceType(),
      browser: detectBrowser(),
      os: detectOS(),
      screenResolution: getScreenResolution(),
      bounced: false,
      converted: true,
      conversionType: type,
      conversionValue: value,
    };

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("Error tracking conversion:", error);
  }
}

// Trackear tiempo en página al salir
let pageStartTime = Date.now();
let hasTrackedTimeOnPage = false;

export function startTrackingTime(): void {
  pageStartTime = Date.now();
  hasTrackedTimeOnPage = false;
}

export async function trackTimeOnPage(): Promise<void> {
  if (hasTrackedTimeOnPage) return;
  
  const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
  hasTrackedTimeOnPage = true;
  
  // Considerar rebote si el tiempo es menor a 10 segundos
  const bounced = timeOnPage < 10;

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageUrl: window.location.pathname,
        pageTitle: document.title,
        referrer: document.referrer || null,
        source: detectSource(),
        medium: detectMedium(),
        sessionId: getSessionId(),
        isNewUser: false,
        deviceType: getDeviceType(),
        browser: detectBrowser(),
        os: detectOS(),
        screenResolution: getScreenResolution(),
        timeOnPage,
        bounced,
        converted: false,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error("Error tracking time on page:", error);
  }
}

// Configurar listeners para trackear tiempo automáticamente
export function setupAutoTracking(): void {
  // Trackear cuando el usuario sale de la página
  window.addEventListener("beforeunload", trackTimeOnPage);
  
  // Trackear cuando la página pierde el foco
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      trackTimeOnPage();
    } else {
      startTrackingTime();
    }
  });
}

