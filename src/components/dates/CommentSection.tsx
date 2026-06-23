"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createDateMemoryComment, deleteDateMemoryComment } from "@/actions/dates";
import { MessageCircle, Trash2 } from "lucide-react";
import type { DateMemoryComment } from "@/types/date-memory";

type CommentSectionProps = {
  memoryId: string;
  comments: DateMemoryComment[];
};

export default function CommentSection({ memoryId, comments }: CommentSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const currentUser = Cookies.get("solace-user") ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;
    setIsPending(true);
    try {
      await createDateMemoryComment(memoryId, text.trim());
      setText("");
      router.refresh();
    } catch {}
    setIsPending(false);
  };

  const handleDelete = async (commentId: string) => {
    await deleteDateMemoryComment(commentId);
    router.refresh();
  };

  return (
    <div className="mt-5 border-t border-[var(--border)] pt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-[var(--muted)]/60 transition-colors hover:text-[var(--accent)]"
      >
        <MessageCircle size={14} />
        {comments.length > 0
          ? `View comments (${comments.length})`
          : "No comments yet"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start justify-between gap-2 rounded-xl bg-[var(--bg-soft)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--accent)]">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-[var(--muted)]/30">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text)]/80">{comment.content}</p>
              </div>
              {comment.author === currentUser && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="mt-0.5 shrink-0 text-[var(--muted)]/30 transition-colors hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              disabled={isPending}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!text.trim() || isPending}
              className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
