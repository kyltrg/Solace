"use client";

import { useEffect, useRef } from "react";

type ParticlesBgProps = {
  quantity?: number;
  color?: string;
  size?: number;
  speed?: number;
};

export function ParticlesBg({
  quantity = 80,
  color = "var(--accent)",
  size = 1.2,
  speed = 0.3,
}: ParticlesBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; dx: number; dy: number; s: number; o: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const getColor = () => {
      const el = document.documentElement;
      const val = getComputedStyle(el).getPropertyValue("--accent").trim();
      return val || "#A88D72";
    };

    for (let i = 0; i < quantity; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * speed,
        dy: (Math.random() - 0.5) * speed,
        s: size * (0.5 + Math.random() * 1),
        o: 0.1 + Math.random() * 0.5,
      });
    }

    const mouse = { x: -1000, y: -1000 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const baseColor = getColor();

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x -= dx * force * 0.008;
          p.y -= dy * force * 0.008;
        }

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = p.o * 0.4;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [quantity, color, size, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
