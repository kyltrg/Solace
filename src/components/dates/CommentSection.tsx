"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createDateMemoryComment, deleteDateMemoryComment } from "@/actions/dates";
import { MessageCircle, Trash2, AlertCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DateMemoryComment } from "@/types/date-memory";

type CommentSectionProps = {
  memoryId: string;
  comments: DateMemoryComment[];
};

export default function CommentSection({ memoryId, comments }: CommentSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const currentUser = Cookies.get("solace-user") ?? "";
  const pendingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPending || pendingRef.current) return;
    setError("");
    pendingRef.current = true;
    setIsPending(true);
    try {
      await createDateMemoryComment(memoryId, text.trim());
      setText("");
      router.refresh();
    } catch {
      setError("Failed to post comment");
    }
    setIsPending(false);
    pendingRef.current = false;
  };

  const handleDelete = async (commentId: string) => {
    await deleteDateMemoryComment(commentId);
    router.refresh();
  };

  return (
    <div className="mx-4 sm:mx-6 border-t border-[var(--border)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-3 text-sm text-[var(--muted)]/50 transition-colors hover:text-[var(--accent)] group"
      >
        <span className="flex items-center gap-2">
          <MessageCircle size={14} />
          {comments.length > 0
            ? `${comments.length} comment${comments.length > 1 ? "s" : ""}`
            : "Leave a comment"}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-[var(--bg-soft)] px-4 py-2.5 ring-1 ring-[var(--border)]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[9px] font-medium text-[var(--accent)]">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-medium text-[var(--accent)]">
                        {comment.author}
                      </span>
                      <span className="text-[9px] text-[var(--muted)]/30">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text)]/80">{comment.content}</p>
                  </div>
                  {comment.author === currentUser && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="mt-0.5 shrink-0 text-[var(--muted)]/20 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              ))}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-4 py-2.5 text-xs text-red-400 ring-1 ring-red-500/20"
                >
                  <AlertCircle size={12} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a comment..."
                  disabled={isPending}
                  className="flex-1 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || isPending}
                  className="shrink-0 rounded-xl bg-[var(--accent)] px-3.5 py-2.5 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 hover:shadow-[0_0_15px_rgba(168,141,114,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isPending ? (
                    <span className="flex h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg)] border-t-transparent" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
