"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";

type Variant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";

const hiddenStyles: Record<Variant, CSSProperties> = {
  fadeUp:    { opacity: 0, transform: "translateY(40px)" },
  fadeIn:    { opacity: 0, transform: "none" },
  slideLeft: { opacity: 0, transform: "translateX(-40px)" },
  slideRight:{ opacity: 0, transform: "translateX(40px)" },
};

const visibleStyle: CSSProperties = {
  opacity: 1,
  transform: "none",
};

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    transition: `opacity 0.6s cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s, transform 0.6s cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s`,
    ...(visible ? visibleStyle : hiddenStyles[variant]),
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
