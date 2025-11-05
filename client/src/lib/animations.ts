import anime from 'animejs';

/**
 * Verificar si el usuario prefiere movimiento reducido
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animación de fade in + slide up
 */
export function fadeInUp(target: HTMLElement | string, delay: number = 0): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    delay: delay,
    easing: 'easeOutCubic'
  });
}

/**
 * Animación de fade in + scale
 */
export function fadeInScale(target: HTMLElement | string, delay: number = 0): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: target,
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    delay: delay,
    easing: 'easeOutBack'
  });
}

/**
 * Animación de entrada para cards con efecto stagger
 */
export function staggerCards(targets: string | HTMLElement[], baseDelay: number = 0): any {
  if (prefersReducedMotion()) {
    return anime({ targets: targets, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: targets,
    opacity: [0, 1],
    translateY: [50, 0],
    scale: [0.9, 1],
    duration: 800,
    delay: anime.stagger(150, { start: baseDelay }),
    easing: 'easeOutExpo'
  });
}

/**
 * Animación de flotación suave para elementos decorativos
 */
export function floatingAnimation(target: HTMLElement | string): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: 1, duration: 0 });
  }

  return anime({
    targets: target,
    translateY: [
      { value: -15, duration: 2000, easing: 'easeInOutSine' },
      { value: 0, duration: 2000, easing: 'easeInOutSine' }
    ],
    loop: true
  });
}

/**
 * Animación de pulso para badges o elementos destacados
 */
export function pulseAnimation(target: HTMLElement | string): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: 1, duration: 0 });
  }

  return anime({
    targets: target,
    scale: [
      { value: 1.05, duration: 1000, easing: 'easeInOutQuad' },
      { value: 1, duration: 1000, easing: 'easeInOutQuad' }
    ],
    loop: true
  });
}

/**
 * Animación de entrada con efecto de onda
 */
export function waveEntrance(targets: string | HTMLElement[]): any {
  if (prefersReducedMotion()) {
    return anime({ targets: targets, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: targets,
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: 600,
    delay: anime.stagger(80),
    easing: 'easeOutQuad'
  });
}

/**
 * Animación de flip para cards
 */
export function flipCard(target: HTMLElement | string, delay: number = 0): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: target,
    opacity: [0, 1],
    rotateY: [-90, 0],
    duration: 800,
    delay: delay,
    easing: 'easeOutExpo'
  });
}

/**
 * Animación de slide desde la izquierda
 */
export function slideInLeft(target: HTMLElement | string, delay: number = 0): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: target,
    opacity: [0, 1],
    translateX: [-50, 0],
    duration: 800,
    delay: delay,
    easing: 'easeOutCubic'
  });
}

/**
 * Animación de slide desde la derecha
 */
export function slideInRight(target: HTMLElement | string, delay: number = 0): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: target,
    opacity: [0, 1],
    translateX: [50, 0],
    duration: 800,
    delay: delay,
    easing: 'easeOutCubic'
  });
}

/**
 * Animación de expansión para elementos colapsables
 */
export function expandElement(target: HTMLElement, expanded: boolean): any {
  if (prefersReducedMotion()) {
    return anime({
      targets: target,
      opacity: expanded ? 1 : 0,
      height: expanded ? 'auto' : 0,
      duration: 0
    });
  }

  return anime({
    targets: target,
    opacity: expanded ? [0, 1] : [1, 0],
    height: expanded ? [0, 'auto'] : ['auto', 0],
    duration: 400,
    easing: 'easeInOutQuad'
  });
}

/**
 * Animación de cascada para galería
 */
export function cascadeGallery(targets: string | HTMLElement[]): any {
  if (prefersReducedMotion()) {
    return anime({ targets: targets, opacity: [0, 1], duration: 0 });
  }

  return anime({
    targets: targets,
    opacity: [0, 1],
    translateY: [60, 0],
    scale: [0.8, 1],
    duration: 1000,
    delay: anime.stagger(100, { grid: [3, 4], from: 'first' }),
    easing: 'easeOutExpo'
  });
}

/**
 * Animación de hover para botones
 */
export function buttonHover(target: HTMLElement): any {
  if (prefersReducedMotion()) {
    return anime({ targets: target, duration: 0 });
  }

  return anime({
    targets: target,
    scale: 1.05,
    duration: 200,
    easing: 'easeOutQuad'
  });
}

/**
 * Animación de hover out para botones
 */
export function buttonHoverOut(target: HTMLElement): any {
  return anime({
    targets: target,
    scale: 1,
    duration: 200,
    easing: 'easeOutQuad'
  });
}

/**
 * Animación del contador de números
 */
export function countUpAnimation(
  element: HTMLElement,
  targetValue: number,
  duration: number = 2000
): any {
  if (prefersReducedMotion()) {
    element.textContent = String(targetValue);
    return anime({ targets: {}, duration: 0 });
  }

  const obj = { value: 0 };

  return anime({
    targets: obj,
    value: targetValue,
    round: 1,
    duration: duration,
    easing: 'easeOutExpo',
    update: () => {
      element.textContent = String(Math.round(obj.value));
    }
  });
}

/**
 * Animación de elementos decorativos flotantes
 */
export function floatingElements(selector: string): void {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    anime({
      targets: element,
      translateY: [
        { value: -20 - (index * 5), duration: 2000 + (index * 300), easing: 'easeInOutSine' },
        { value: 0, duration: 2000 + (index * 300), easing: 'easeInOutSine' }
      ],
      translateX: [
        { value: -10 + (index * 3), duration: 2500 + (index * 200), easing: 'easeInOutSine' },
        { value: 0, duration: 2500 + (index * 200), easing: 'easeInOutSine' }
      ],
      opacity: [
        { value: 0.3, duration: 1500, easing: 'easeInOutSine' },
        { value: 0.6, duration: 1500, easing: 'easeInOutSine' }
      ],
      loop: true,
      delay: index * 200
    });
  });
}

