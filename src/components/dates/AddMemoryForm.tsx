"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { createDateMemory } from "@/actions/dates";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ImagePlus, X, GripVertical, Image as ImageIcon, Heart, MapPin, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddMemoryForm(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const remaining = 5 - files.length;
    const add = selected.slice(0, remaining);
    setFiles((prev) => [...prev, ...add]);
    add.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((p) => [...p, reader.result as string]);
      reader.readAsDataURL(f);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newFiles = [...files];
    const newPreviews = [...previews];
    const [f] = newFiles.splice(dragIdx, 1);
    const [p] = newPreviews.splice(dragIdx, 1);
    newFiles.splice(idx, 0, f);
    newPreviews.splice(idx, 0, p);
    setFiles(newFiles);
    setPreviews(newPreviews);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  const reset = () => {
    formRef.current?.reset();
    setFiles([]);
    setPreviews([]);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      if (files.length > 0) {
        const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
        formData.set("images", JSON.stringify(urls));
      }
      await createDateMemory(formData);
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
    setIsPending(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="group relative w-full overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)] hover:shadow-[0_0_40px_rgba(168,141,114,0.08)] text-left"
      >
        <div className="pointer-events-none absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/5 to-[var(--accent)]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-soft)] to-[var(--accent)]/5 ring-1 ring-[var(--accent)]/10">
            <Heart size={18} className="text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)]">Write a memory</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]/40">Share a moment worth keeping</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] transition-all group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent-soft)]">
            <ImagePlus size={15} className="text-[var(--muted)]/50 transition-colors group-hover:text-[var(--accent)]" />
          </div>
        </div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-md md:items-center"
            onClick={() => { if (!isPending) { reset(); setOpen(false); } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg)] to-[var(--bg-soft)] p-6 shadow-2xl shadow-black/40 md:rounded-3xl md:max-h-[85vh]"
            >
              {/* Header */}
              <div className="mb-7 text-center md:text-left">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-soft)] to-[var(--accent)]/5 ring-1 ring-[var(--accent)]/10 md:mx-0">
                  <Heart size={18} className="text-[var(--accent)]" />
                </div>
                <h2 className="font-display text-2xl font-medium">New memory</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">A moment we never want to forget.</p>
                <button
                  onClick={() => { reset(); setOpen(false); }}
                  disabled={isPending}
                  className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)] disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  required
                  name="title"
                  disabled={isPending}
                  placeholder="Coffee date"
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-4 text-sm outline-none placeholder:text-[var(--muted)]/25 transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] disabled:opacity-50"
                />

                <textarea
                  name="description"
                  disabled={isPending}
                  placeholder="What happened? Tell the story..."
                  className="h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-4 text-sm outline-none placeholder:text-[var(--muted)]/25 transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] resize-none disabled:opacity-50"
                />

                <div className="relative">
                  <MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)]/30" />
                  <input
                    name="location"
                    disabled={isPending}
                    placeholder="Where was this?"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] pl-11 pr-5 py-4 text-sm outline-none placeholder:text-[var(--muted)]/25 transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] disabled:opacity-50"
                  />
                </div>

                <input
                  required
                  type="date"
                  name="memoryDate"
                  disabled={isPending}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-4 text-sm outline-none transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] disabled:opacity-50 [color-scheme:dark]"
                />

                {previews.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs text-[var(--muted)]/40 uppercase tracking-wider">
                      Photos ({previews.length}/5)
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {previews.map((src, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={() => handleDragStart(i)}
                          onDragOver={(e) => handleDragOver(e, i)}
                          onDragEnd={handleDragEnd}
                          className={`group relative cursor-grab overflow-hidden rounded-2xl border border-[var(--border)] transition-all h-22 w-22 ${dragIdx === i ? "opacity-50 scale-95 ring-2 ring-[var(--accent)]" : "hover:ring-1 hover:ring-[var(--accent)]/30"}`}
                        >
                          <img src={src} alt="" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                            <GripVertical size={16} className="text-white/0 transition-all group-hover:text-white/80" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)]/30 p-5 text-sm text-[var(--muted)]/50 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/20 hover:text-[var(--accent)]/70 disabled:opacity-50"
                  >
                    <ImagePlus size={18} />
                    {files.length === 0 ? "Add photos" : `Add ${5 - files.length} more`}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 rounded-2xl bg-red-500/10 px-5 py-3.5 text-sm text-red-400 ring-1 ring-red-500/20"
                  >
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="relative mt-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/90 px-7 py-4 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-95 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(168,141,114,0.3)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg)] border-t-transparent" />
                      Saving...
                    </span>
                  ) : "Save Memory"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingOverlay phrase="Putting this where we'll find it again." visible={isPending} />
    </>
  );
}
