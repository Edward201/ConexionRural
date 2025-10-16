import { useEffect, useCallback } from "react";
import { useLocation as useWouterLocation } from "wouter";
import {
  trackPageView,
  trackConversion,
  startTrackingTime,
  setupAutoTracking,
} from "@/lib/analytics";

/**
 * Hook para tracking de analytics
 * Trackea automáticamente cada cambio de ruta
 */
export function useAnalytics() {
  const [location] = useWouterLocation();

  // Configurar auto-tracking una sola vez
  useEffect(() => {
    setupAutoTracking();
  }, []);

  // Trackear cada cambio de página
  useEffect(() => {
    const url = location;
    const title = document.title;

    // Pequeño delay para asegurar que el título se haya actualizado
    const timeoutId = setTimeout(() => {
      trackPageView(url, document.title || title);
      startTrackingTime();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);

  // Función para trackear conversiones manualmente
  const logConversion = useCallback(
    (type: string, value?: number) => {
      trackConversion(type, value);
    },
    []
  );

  return { logConversion };
}

