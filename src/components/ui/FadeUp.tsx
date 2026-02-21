'use client';

import { useInView } from '@/hooks/useInView';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Wraps children in a fade-up + translate reveal triggered by IntersectionObserver.
 * Use `delay` (ms) to stagger sibling elements.
 */
export default function FadeUp({ children, delay = 0, className = '' }: Props) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-700 ease-out will-change-transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
