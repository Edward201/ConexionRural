import { useEffect, useRef, RefObject } from 'react';
import anime from 'animejs';

/**
 * Hook personalizado para animaciones con anime.js
 * Maneja la creación y limpieza automática de animaciones
 */
export function useAnime<T extends HTMLElement = HTMLElement>(
  animation: (target: T) => any,
  deps: any[] = []
): RefObject<T> {
  const ref = useRef<T>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      animationRef.current = animation(ref.current);
    }

    return () => {
      if (animationRef.current) {
        // Limpiar animación al desmontar
        animationRef.current.pause();
      }
    };
  }, deps);

  return ref;
}

/**
 * Hook para animaciones al hacer scroll (Intersection Observer)
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  animation: (target: T) => any,
  options: IntersectionObserverInit = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const animationRef = useRef<any>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          if (ref.current) {
            animationRef.current = animation(ref.current);
          }
        }
      });
    }, {
      threshold: 0.3, // 30% del elemento debe ser visible
      rootMargin: '-200px 0px -100px 0px', // Se activa solo cuando está bien dentro del viewport
      ...options
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  return ref;
}

/**
 * Hook para contador animado
 */
export function useCountUp(
  targetNumber: number,
  duration: number = 2000,
  shouldStart: boolean = true
) {
  const ref = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || !shouldStart) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      ref.current.textContent = String(targetNumber);
      return;
    }

    const obj = { value: 0 };

    animationRef.current = anime({
      targets: obj,
      value: targetNumber,
      round: 1,
      duration: duration,
      easing: 'easeOutExpo',
      update: () => {
        if (ref.current) {
          ref.current.textContent = String(Math.round(obj.value));
        }
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [targetNumber, duration, shouldStart]);

  return ref;
}

