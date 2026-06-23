"use client";

import { useRef, useState, type FormEvent } from "react";
import { createDateMemory } from "@/actions/dates";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { compressImage, type AspectRatio } from "@/lib/compress-image";
import { ImagePlus, X, GripVertical, Image as ImageIcon, Square, Crop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddMemoryForm(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
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
    setAspectRatio("1:1");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    if (files.length > 0) {
      const compressed = await Promise.all(
        files.map((f) => compressImage(f, aspectRatio))
      );
      formData.set("images", JSON.stringify(compressed));
    }
    try {
      await createDateMemory(formData);
      reset();
      setOpen(false);
      router.refresh();
    } catch {}
    setIsPending(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)] text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <ImageIcon size={16} className="text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)]">What's on your mind?</p>
            <p className="text-xs text-[var(--muted)]/40">Share a memory...</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)]">
            <ImagePlus size={14} className="text-[var(--muted)]/50" />
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
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center"
            onClick={() => { if (!isPending) { reset(); setOpen(false); } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-t-3xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-2xl md:rounded-3xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-medium">Write a memory</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">A moment we never want to forget.</p>
                </div>
                <button
                  onClick={() => { reset(); setOpen(false); }}
                  disabled={isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)] disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  name="title"
                  disabled={isPending}
                  placeholder="Coffee date"
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
                />

                <textarea
                  name="description"
                  disabled={isPending}
                  placeholder="What happened?"
                  className="h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 resize-none disabled:opacity-50"
                />

                <input
                  name="location"
                  disabled={isPending}
                  placeholder="Location (optional)"
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none placeholder:text-[var(--muted)]/30 transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
                />

                <input
                  required
                  type="date"
                  name="memoryDate"
                  disabled={isPending}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm outline-none transition-all focus:border-[var(--accent)]/50 disabled:opacity-50"
                />

                {previews.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-3">
                      {previews.map((src, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={() => handleDragStart(i)}
                          onDragOver={(e) => handleDragOver(e, i)}
                          onDragEnd={handleDragEnd}
                          className={`group relative cursor-grab overflow-hidden rounded-xl border border-[var(--border)] transition-all ${
                            aspectRatio === "1:1" ? "h-20 w-20" : "h-20 w-16"
                          } ${dragIdx === i ? "opacity-50 scale-95" : ""}`}
                        >
                          <img src={src} alt="" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
                            <GripVertical size={14} className="text-white/0 transition-all group-hover:text-white/70" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow transition-transform hover:scale-110"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[.15em] text-[var(--muted)]/40">Crop</span>
                      <div className="flex rounded-lg border border-[var(--border)] p-0.5">
                        <button
                          type="button"
                          onClick={() => setAspectRatio("1:1")}
                          disabled={isPending}
                          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                            aspectRatio === "1:1"
                              ? "bg-[var(--accent)] text-[var(--bg)]"
                              : "text-[var(--muted)]/50 hover:text-[var(--text)]"
                          }`}
                        >
                          <Square size={12} />
                          1:1
                        </button>
                        <button
                          type="button"
                          onClick={() => setAspectRatio("4:5")}
                          disabled={isPending}
                          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                            aspectRatio === "4:5"
                              ? "bg-[var(--accent)] text-[var(--bg)]"
                              : "text-[var(--muted)]/50 hover:text-[var(--text)]"
                          }`}
                        >
                          <Crop size={12} />
                          4:5
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)]/50 p-4 text-sm text-[var(--muted)]/50 transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]/70 disabled:opacity-50"
                  >
                    <ImagePlus size={18} />
                    {files.length === 0 ? "Add photos (max 5)" : `Add ${5 - files.length} more`}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-90 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Memory"}
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
