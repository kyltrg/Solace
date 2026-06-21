"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { createLetter } from "@/actions/letters";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const CATEGORIES = [
  "Love", "Memory", "Gratitude", "Apology", "Promise", "Dream", "Secret", "Poem", "Note", "Letter",
];

export default function ComposerForm({ user }: { user: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Love");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", content);
    fd.set("category", category);

    const result = await createLetter(fd);
    if (result.ok && result.id) {
      router.push(`/letters?highlight=${result.id}`);
    } else {
      setError(result.error || "Something went wrong.");
      setSending(false);
    }
  };

  return (
    <>
      <LoadingOverlay phrase="Folding your letter carefully..." visible={sending} />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit}
        className={`vintage-paper rounded-[24px] p-8 md:p-12 transition-all duration-500 ${
          sending ? "scale-[0.97] opacity-40 blur-[1px]" : ""
        }`}
      >
        <div className="relative z-10 space-y-8">
          {user && (
            <p className="text-xs uppercase tracking-[.3em] text-[var(--ink)]/50">
              Writing as {user}
            </p>
          )}

          <div>
            <label htmlFor="category" className="sr-only">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-b border-[var(--ink)]/15 bg-transparent pb-2 text-sm font-medium text-[var(--ink)] outline-none transition-colors focus:border-[var(--ink)]/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="sr-only">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={sending}
              placeholder="Title of your letter…"
              className="w-full bg-transparent text-3xl font-display text-[var(--ink)] placeholder-[var(--ink)]/25 outline-none md:text-4xl disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="sr-only">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
              placeholder="Dear you…"
              rows={14}
              className="w-full resize-none bg-transparent font-serif text-base leading-[2.2] text-[var(--ink)] placeholder-[var(--ink)]/25 outline-none disabled:opacity-50"
              required
            />
          </div>

          <div className="flex items-center justify-between border-t border-[var(--ink)]/15 pt-5">
            <span className="text-xs text-[var(--ink)]/40">{content.length} characters</span>
            <button
              type="submit"
              disabled={sending || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper-soft)] transition-all duration-300 hover:opacity-80 disabled:pointer-events-none disabled:opacity-30"
            >
              <Send size={16} />
              <span>{sending ? "Sealing…" : "Seal & Send"}</span>
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </motion.form>
    </>
  );
}
