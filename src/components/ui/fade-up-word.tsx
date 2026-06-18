"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";

type FadeUpWordProps = {
  children: string;
  className?: string;
  as?: ElementType;
};

export function FadeUpWord({
  children,
  className,
  as: Component = "div",
}: FadeUpWordProps) {
  return (
    <Component className={className}>
      {children.split(" ").map((word, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * 0.08,
          }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}