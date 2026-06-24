"use client";

import { useState, useCallback, useRef } from "react";
import type { DateMemory } from "@/types/date-memory";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, MessageCircle } from "lucide-react";
import { toggleDateMemoryLike } from "@/actions/dates";
import { parseImages, type ImageSet } from "@/lib/images";
import { getPfp } from "@/lib/pfp";
import ImageCarousel from "./ImageCarousel";
import ImageLightbox from "./ImageLightbox";
import CommentSection from "./CommentSection";
import Cookies from "js-cookie";

export default function DateCard({ memory }: { memory: DateMemory }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const currentUser = Cookies.get("solace-user")?.toLowerCase() ?? "";

  const parsed: ImageSet = parseImages(memory.images);
  const images = parsed.urls;

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
  const authorInitial = memory.author?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/70 text-xs font-bold text-white shadow-sm">
          {getPfp(memory.author) ? (
            <img src={getPfp(memory.author)!} alt={memory.author ?? ""} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            authorInitial
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] leading-tight truncate">
            {memory.author ?? "Someone"}
          </p>
          <p className="text-[11px] text-[var(--muted)]/50 leading-tight">
            {memoryDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        {memory.location && (
          <div className="flex items-center gap-1 text-xs text-[var(--muted)]/40 shrink-0">
            <MapPin size={11} />
            <span className="truncate max-w-24">{memory.location}</span>
          </div>
        )}
      </div>

      {/* Image */}
      {images.length > 0 && (
        <ImageCarousel
          imageSet={{ urls: images, crops: parsed.crops }}
          onImageClick={(i) => setLightboxIndex(i)}
          onDoubleTap={handleLike}
          liked={isLiked}
        />
      )}

      {/* Actions bar */}
      <div className="flex items-center gap-4 px-4 pt-3 pb-1">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-sm transition-all active:scale-90"
        >
          <motion.div
            key={isLiked ? "liked" : "unliked"}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Heart
              size={20}
              className={
                isLiked
                  ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                  : "text-[var(--muted)]/40 transition-colors hover:text-red-400"
              }
            />
          </motion.div>
        </button>
        <div className="flex items-center gap-1.5 text-sm text-[var(--muted)]/40">
          <MessageCircle size={19} />
        </div>
        <div className="ml-auto flex items-center gap-1 text-[11px] text-[var(--muted)]/30">
          <Clock size={10} />
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

      {/* Like count */}
      {likedBy.length > 0 && (
        <p className="px-4 text-sm font-semibold text-[var(--text)]">
          {likedBy.length.toLocaleString()} {likedBy.length === 1 ? "like" : "likes"}
        </p>
      )}

      {/* Caption */}
      <div className="px-4 pt-1 pb-3">
        <p className="text-sm">
          <span className="font-semibold text-[var(--text)]">{memory.author ?? "Someone"}</span>
          {" "}
          <span className="text-[var(--muted)]">{memory.title}</span>
        </p>
        {memory.description && (
          <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
            {memory.description}
          </p>
        )}
      </div>

      <CommentSection memoryId={memory.id} comments={memory.comments} />

      {lightboxIndex !== null && (
        <ImageLightbox
          imageSet={{ urls: images, crops: parsed.crops }}
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
