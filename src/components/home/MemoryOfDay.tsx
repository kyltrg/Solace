"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

type Memory = {
  date: string;
  title: string;
  image: string;
  text: string;
};

const memories: Memory[] = [
  {
    date: "March 29, 2026",
    title: "Our first McDo",
    image: "/assets/memories/mcdo.jpg",
    text: "Our first little date. Simple lang, pero I still remember it.",
  },
  {
    date: "May 21, 2026",
    title: "A little secret",
    image: "/assets/memories/secret.jpg",
    text: "A moment that only we understand. One of my favorite memories. Alam mo na why hehe.",
  },
  {
    date: "June 13, 2026",
    title: "Meeting my family",
    image: "/assets/memories/family.jpg",
    text: "I loved seeing you there. It felt like you were slowly becoming part of my own little world.",
  },
];

export default function MemoryOfDay(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[.35em] text-[var(--accent)]"
        >
          Memory trail
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6, ease: [.22,1,.36,1] }}
          className="mt-5 font-display text-4xl sm:text-6xl font-light md:text-8xl"
        >
          Little moments
        </motion.h2>

        <div className="relative mt-24">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--border)] md:block" />

          <div className="space-y-24">
            {memories.map((memory, index) => (
              <motion.article
                key={memory.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: .8, delay: index * .15, ease: [.22,1,.36,1] }}
                className={`relative flex ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
              >
                <div className="group max-w-md">
                  <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={memory.image}
                        alt={memory.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 backdrop-blur-md">
                      <Heart size={16} className="text-[var(--accent)]" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[.3em] text-[var(--accent)]">{memory.date}</p>
                    <h3 className="mt-3 font-display text-2xl sm:text-4xl font-light">{memory.title}</h3>
                    <p className="mt-4 leading-relaxed text-[var(--muted)]">{memory.text}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
