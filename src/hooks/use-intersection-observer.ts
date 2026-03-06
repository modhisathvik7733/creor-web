import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(el);
        }
      },
      { threshold: options?.threshold ?? 0.1, rootMargin: options?.rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return { ref, isIntersecting };
}
