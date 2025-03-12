import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Custom ease for smooth animations
CustomEase.create('smoothReveal', '0.6, 0, 0.1, 1');

interface AnimationConfig {
  trigger: Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  pin?: boolean;
  anticipatePin?: boolean;
}

export const fadeUpStagger = (elements: Element[], staggerDelay = 0.1, config: Partial<AnimationConfig> = {}) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: staggerDelay,
      ease: 'smoothReveal',
      scrollTrigger: {
        trigger: config.trigger || elements[0],
        start: config.start || 'top 80%',
        toggleActions: config.toggleActions || 'play none none reverse',
        ...config
      }
    }
  );
};

export const parallaxEffect = (element: Element, intensity = 30, config: Partial<AnimationConfig> = {}) => {
  return gsap.fromTo(
    element,
    { y: 0 },
    {
      y: -intensity,
      ease: 'none',
      scrollTrigger: {
        trigger: config.trigger || element,
        start: config.start || 'top bottom',
        end: config.end || 'bottom top',
        scrub: config.scrub ?? true,
        ...config
      }
    }
  );
};

export const scaleReveal = (element: Element, config: Partial<AnimationConfig> = {}) => {
  return gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'smoothReveal',
      scrollTrigger: {
        trigger: config.trigger || element,
        start: config.start || 'top 85%',
        toggleActions: config.toggleActions || 'play none none reverse',
        ...config
      }
    }
  );
};

export const textSplitReveal = (element: Element, config: Partial<AnimationConfig> = {}) => {
  const text = element.textContent || '';
  element.textContent = '';
  
  const chars = text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    element.appendChild(span);
    return span;
  });

  return gsap.fromTo(
    chars,
    { opacity: 0, y: 50, rotateX: 90 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      stagger: 0.02,
      ease: 'smoothReveal',
      scrollTrigger: {
        trigger: config.trigger || element,
        start: config.start || 'top 85%',
        toggleActions: config.toggleActions || 'play none none reverse',
        ...config
      }
    }
  );
};

export const horizontalScroll = (element: Element, config: Partial<AnimationConfig> = {}) => {
  return gsap.fromTo(
    element,
    { x: '100%' },
    {
      x: '-100%',
      ease: 'none',
      scrollTrigger: {
        trigger: config.trigger || element,
        start: config.start || 'top center',
        end: config.end || 'bottom center',
        scrub: config.scrub ?? 1,
        pin: config.pin ?? true,
        anticipatePin: config.anticipatePin ?? true,
        ...config
      }
    }
  );
};

export const rotateIn3D = (element: Element, config: Partial<AnimationConfig> = {}) => {
  return gsap.fromTo(
    element,
    { 
      rotationY: 90,
      opacity: 0,
      transformPerspective: 1000,
      transformOrigin: '0% 50%'
    },
    {
      rotationY: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'smoothReveal',
      scrollTrigger: {
        trigger: config.trigger || element,
        start: config.start || 'top 75%',
        toggleActions: config.toggleActions || 'play none none reverse',
        ...config
      }
    }
  );
};

export const clipPathReveal = (element: Element, config: Partial<AnimationConfig> = {}) => {
  return gsap.fromTo(
    element,
    { 
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      opacity: 0
    },
    {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      opacity: 1,
      duration: 1.2,
      ease: 'smoothReveal',
      scrollTrigger: {
        trigger: config.trigger || element,
        start: config.start || 'top 80%',
        toggleActions: config.toggleActions || 'play none none reverse',
        ...config
      }
    }
  );
}; 