"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const UNASSIGNED_IMAGES = [
  "/assets/our-story/image08.jpg",
  "/assets/our-story/image09.jpg",
  "/assets/our-story/image10.jpg",
  "/assets/our-story/image11.jpg",
  "/assets/our-story/image12.jpg",
  "/assets/our-story/image13.jpg",
];

const polaroidZ = 5;

type Pos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  width: string;
  delay: number;
};

const POSITIONS: Pos[] = [
  { top: "8%",  left: "-14rem",  rotate: -7, width: "17rem", delay: 0 },
  { top: "22%", right: "-14rem", rotate: 5,  width: "16rem", delay: 0.1 },
  { top: "40%", left: "-14rem",  rotate: -5, width: "18rem", delay: 0.2 },
  { top: "58%", right: "-14rem", rotate: 7,  width: "15rem", delay: 0.15 },
  { top: "76%", left: "-14rem",  rotate: -8, width: "16rem", delay: 0.25 },
  { bottom: "5%", right: "-14rem", rotate: 6,  width: "17rem", delay: 0.3 },
];

const FLOATS = [
  { y: [-5, 5, -5], duration: 4.5 },
  { y: [4, -3, 4], duration: 5.2 },
  { y: [-3, 6, -3], duration: 3.8 },
  { y: [5, -4, 5], duration: 4.8 },
  { y: [-6, 2, -6], duration: 5.5 },
  { y: [3, -5, 3], duration: 4.2 },
];

export function FloatingPolaroids() {
  const items = useMemo(
    () =>
      UNASSIGNED_IMAGES.map((src, i) => {
        const pos = POSITIONS[i];
        const floatAnim = FLOATS[i % FLOATS.length];
        const extraRotate = (i % 3 - 1) * 2;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.4, rotate: -15 + extraRotate }}
            whileInView={{ opacity: 1, scale: 1, rotate: pos.rotate + extraRotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 1,
              delay: pos.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "absolute",
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              zIndex: polaroidZ + i,
              width: pos.width,
            }}
            className="pointer-events-none hidden md:block"
          >
            <motion.div
              animate={{ y: floatAnim.y }}
              transition={{
                duration: floatAnim.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="group relative bg-[var(--paper)] p-2 pb-10 shadow-2xl transition-shadow duration-500 hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-105"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />
                </div>
                <div className="absolute bottom-2 left-0 right-0 px-3 text-center">
                  <span className="font-hand text-[10px] italic tracking-wide text-[var(--muted)]/50">
                    {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      }),
    [],
  );

  return <>{items}</>;
}
