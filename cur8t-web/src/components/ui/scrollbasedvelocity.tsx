'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface VelocityScrollProps {
  text: string;
  default_velocity?: number;
  className?: string;
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export const VelocityScroll: React.FC<VelocityScrollProps> = ({
  text,
  default_velocity = 5,
  className,
}) => {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ParallaxText: React.FC<ParallaxProps> = ({
    children,
    baseVelocity = 100,
    className,
  }) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 60,
      stiffness: 300,
      restDelta: 0.001,
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3], {
      clamp: false,
    });

    const [repetitions, setRepetitions] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const lastTime = useRef(0);

    useEffect(() => {
      const calculateRepetitions = () => {
        if (containerRef.current && textRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const textWidth = textRef.current.offsetWidth;
          const newRepetitions = Math.ceil(containerWidth / textWidth) + 2;
          setRepetitions(newRepetitions);
        }
      };

      calculateRepetitions();

      // Use ResizeObserver for better performance than window resize
      let resizeObserver: ResizeObserver | null = null;
      let useWindowResize = false;

      // Check if we're in browser environment
      const isBrowser = typeof window !== 'undefined';

      if (isBrowser) {
        if ('ResizeObserver' in window) {
          resizeObserver = new ResizeObserver(calculateRepetitions);
          if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
          }
        } else {
          // Fallback to window resize for older browsers
          useWindowResize = true;
          (window as Window).addEventListener('resize', calculateRepetitions);
        }
      }

      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        if (useWindowResize && isBrowser) {
          (window as Window).removeEventListener(
            'resize',
            calculateRepetitions
          );
        }
      };
    }, [children]);

    const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
      // Skip if reduced motion is preferred
      if (prefersReducedMotion) return;

      // Throttle updates to ~30fps instead of 60fps for better performance
      if (t - lastTime.current < 33) return;
      lastTime.current = t;

      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      const velocity = velocityFactor.get();
      if (velocity < 0) {
        directionFactor.current = -1;
      } else if (velocity > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocity;
      baseX.set(baseX.get() + moveBy);
    });

    return (
      <div
        className="w-full overflow-hidden whitespace-nowrap"
        ref={containerRef}
        style={{ willChange: 'auto' }}
      >
        <motion.div
          className={cn('inline-block transform-gpu', className)}
          style={{
            x,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          {Array.from({ length: repetitions }).map((_, i) => (
            <span key={i} ref={i === 0 ? textRef : null}>
              {children}{' '}
            </span>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="relative w-full">
      <ParallaxText baseVelocity={default_velocity} className={className}>
        {text}
      </ParallaxText>
      <ParallaxText baseVelocity={-default_velocity} className={className}>
        {text}
      </ParallaxText>
    </section>
  );
};
