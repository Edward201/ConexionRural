/**
 * Analytics library
 * Functions to detect devices, browsers, traffic sources, etc.
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

/**
 * Detects the type of device.
 * @returns {"mobile" | "desktop" | "tablet"} The type of device.
 */
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

/**
 * Detects the browser.
 * @returns {string} The name of the browser.
 */
export function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown";
}

/**
 * Detects the operating system.
 * @returns {string} The name of the operating system.
 */
export function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "Mac OS";
  if (ua.includes("X11") || ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
}

/**
 * Gets or creates a session ID.
 * @returns {string} The session ID.
 */
export function getSessionId(): string {
  const storageKey = "analytics_session_id";
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

/**
 * Detects the traffic source.
 * @returns {string} The traffic source.
 */
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

/**
 * Detects the medium (specific social network or search engine).
 * @returns {string | null} The medium.
 */
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

/**
 * Checks if it is the first visit.
 * @returns {boolean} Whether it is the first visit.
 */
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

/**
 * Gets the screen resolution.
 * @returns {string} The screen resolution.
 */
export function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

/**
 * Gets the geolocation data (simplified, use API in production).
 * @returns {Promise<{ country: string; city: string } | null>} The geolocation data.
 */
export async function getLocation(): Promise<{ country: string; city: string } | null> {
  try {
    // In production, use an API like ipapi.co or geoip
    return { country: "Colombia", city: "Bogotá" };
  } catch (error) {
    return null;
  }
}

/**
 * Tracks a page view event.
 * @param {string} url - The URL of the page.
 * @param {string} title - The title of the page.
 */
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
      keepalive: true, // Ensures it is sent even if the user closes the page
    });
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
}

/**
 * Tracks a conversion.
 * @param {string} type - The type of conversion.
 * @param {number} [value] - The value of the conversion.
 */
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

// Track time on page when leaving
let pageStartTime = Date.now();
let hasTrackedTimeOnPage = false;

/**
 * Starts tracking time on page.
 */
export function startTrackingTime(): void {
  pageStartTime = Date.now();
  hasTrackedTimeOnPage = false;
}

/**
 * Tracks the time spent on the page.
 */
export async function trackTimeOnPage(): Promise<void> {
  if (hasTrackedTimeOnPage) return;
  
  const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
  hasTrackedTimeOnPage = true;
  
  // Consider bounce if time is less than 10 seconds
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

/**
 * Sets up listeners to automatically track time.
 */
export function setupAutoTracking(): void {
  // Track when the user leaves the page
  window.addEventListener("beforeunload", trackTimeOnPage);
  
  // Track when the page loses focus
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      trackTimeOnPage();
    } else {
      startTrackingTime();
    }
  });
}

