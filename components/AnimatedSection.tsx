"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
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
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
}
