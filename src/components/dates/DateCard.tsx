"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { DateMemory } from "@/types/date-memory";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, CalendarDays } from "lucide-react";
import { toggleDateMemoryLike } from "@/actions/dates";
import { parseImages, type ImageSet } from "@/lib/images";
import ImageCarousel from "./ImageCarousel";
import ImageLightbox from "./ImageLightbox";
import CommentSection from "./CommentSection";
import Cookies from "js-cookie";

export default function DateCard({ memory }: { memory: DateMemory }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const router = useRouter();
  const currentUser = Cookies.get("solace-user")?.toLowerCase() ?? "";

  const parsed: ImageSet = parseImages(memory.images);
  const images = parsed.urls;
  const crops = parsed.crops;

  const initialLikedBy: string[] = (() => {
    try {
      return JSON.parse(memory.likedBy);
    } catch {
      return [];
    }
  })();

  const [likedBy, setLikedBy] = useState(initialLikedBy);
  const isLiked = currentUser ? likedBy.includes(currentUser) : false;
  const likeRef = useRef({ pending: false });

  const handleLike = useCallback(async () => {
    if (likeRef.current.pending) return;
    likeRef.current.pending = true;

    const newLikedBy = [...likedBy];
    const idx = newLikedBy.indexOf(currentUser);
    if (idx > -1) {
      newLikedBy.splice(idx, 1);
    } else {
      if (newLikedBy.length >= 2) { likeRef.current.pending = false; return; }
      newLikedBy.push(currentUser);
    }

    setLikedBy(newLikedBy);

    try {
      await toggleDateMemoryLike(memory.id);
    } catch {
      setLikedBy(likedBy);
    }
    likeRef.current.pending = false;
  }, [likedBy, currentUser, memory.id]);

  const memoryDate = new Date(memory.memoryDate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl transition-all duration-500 hover:border-[var(--accent)]/25 hover:bg-[var(--card-hover)] hover:shadow-[0_0_60px_rgba(168,141,114,0.06)]"
    >
      {/* Warm glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--accent)]/8 blur-3xl transition-all duration-700 group-hover:bg-[var(--accent)]/15" />

      <div className="relative">
        {images.length > 0 && (
          <div className="p-4 pb-0 sm:p-6 sm:pb-0">
            <ImageCarousel
              imageSet={{ urls: images, crops }}
              onImageClick={(i) => setLightboxIndex(i)}
              onDoubleTap={handleLike}
              liked={isLiked}
            />
          </div>
        )}

        <div className="px-4 sm:px-6 pt-5 sm:pt-5">
          {/* Date badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3.5 py-1.5 ring-1 ring-[var(--accent)]/10">
            <CalendarDays size={11} className="text-[var(--accent)]" />
            <span className="text-[11px] font-medium text-[var(--accent)]">
              {memoryDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight md:text-3xl">
            {memory.title}
          </h3>

          {memory.description && (
            <p className="mt-3 leading-relaxed text-[var(--muted)] text-sm md:text-base">
              {memory.description}
            </p>
          )}

          {memory.location && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted)]/50">
              <MapPin size={12} />
              <span>{memory.location}</span>
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="mx-4 sm:mx-6 mt-5 mb-1 flex items-center gap-5 border-t border-[var(--border)] pt-4 pb-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-sm transition-all active:scale-90 group/like"
          >
            <motion.div
              key={isLiked ? "liked" : "unliked"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart
                size={17}
                className={
                  isLiked
                    ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                    : "text-[var(--muted)]/40 transition-colors group-hover/like:text-red-400"
                }
              />
            </motion.div>
            <span className={isLiked ? "text-red-500 text-sm font-medium" : "text-[var(--muted)]/40 text-sm"}>
              {likedBy.length > 0 ? likedBy.length : ""}
              <span className="ml-1 hidden sm:inline">{likedBy.length === 1 ? "like" : likedBy.length > 1 ? "likes" : "Like"}</span>
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]/30">
            <Clock size={11} />
            <span>
              {new Date(memory.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <CommentSection memoryId={memory.id} comments={memory.comments} />
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          imageSet={{ urls: images, crops }}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev === null || prev === 0 ? images.length - 1 : prev - 1
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev === null || prev === images.length - 1 ? 0 : prev + 1
            )
          }
        />
      )}
    </motion.article>
  );
}
