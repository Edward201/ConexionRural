import { useEffect, useCallback } from "react";
import { useLocation as useWouterLocation } from "wouter";
import {
  trackPageView,
  trackConversion,
  startTrackingTime,
  setupAutoTracking,
} from "@/lib/analytics";

/**
 * A hook for tracking analytics.
 * It automatically tracks route changes and provides a function to manually track conversions.
 * @returns {{logConversion: (type: string, value?: number) => void}} - An object containing the logConversion function.
 */
export function useAnalytics() {
  const [location] = useWouterLocation();

  // Set up auto-tracking once.
  useEffect(() => {
    setupAutoTracking();
  }, []);

  // Track each page change.
  useEffect(() => {
    const url = location;
    const title = document.title;

    // A small delay to ensure the title has been updated.
    const timeoutId = setTimeout(() => {
      trackPageView(url, document.title || title);
      startTrackingTime();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);

  // A function to manually track conversions.
  const logConversion = useCallback(
    (type: string, value?: number) => {
      trackConversion(type, value);
    },
    []
  );

  return { logConversion };
}

