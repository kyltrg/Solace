"use client";

import { useScroll, useSpring } from "framer-motion";

export default function useScrollProgress() {
	const { scrollYProgress } = useScroll();

	return useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 24,
		mass: 0.2,
	});
}
