"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { createDateMemory } from "@/actions/dates";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  ImagePlus, X, Heart, MapPin, Check,
  ChevronLeft, ChevronRight, ZoomIn, Square, Maximize,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageCropper, { type CropState, type AspectRatioOption } from "./ImageCropper";

type Step = 1 | 2 | 3;

type ImageItem = {
  file: File;
  preview: string;
  crop: CropState;
};

const INITIAL_CROP: CropState = { scale: 1, offsetX: 0, offsetY: 0 };

const ASPECTS: AspectRatioOption[] = ["1:1", "4:5", "free"];

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <span
      className={`block h-2 rounded-full transition-all ${
        done ? "w-6 bg-[var(--accent)]" : active ? "w-6 bg-[var(--accent)]/80" : "w-2 bg-[var(--border)]"
      }`}
    />
  );
}

export default function AddMemoryForm(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [isPending, setIsPending] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>("4:5");
  const [cropIdx, setCropIdx] = useState(0);
  const [error, setError] = useState("");
  const [naturalRatios, setNaturalRatios] = useState<Record<number, number>>({});
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset everything
  const reset = () => {
    formRef.current?.reset();
    setImages([]);
    setStep(1);
    setError("");
    setCropIdx(0);
    setAspectRatio("4:5");
    setNaturalRatios({});
    setImgErrors(new Set());
  };

  const close = () => {
    if (isPending) return;
    reset();
    setOpen(false);
  };

  // --- Image upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const remaining = 5 - images.length;
    const add = selected.slice(0, remaining);
    add.forEach((file, fileIdx) => {
      const globalIdx = images.length + fileIdx;
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        setImages((prev) => [
          ...prev,
          { file, preview, crop: { ...INITIAL_CROP } },
        ]);
        const img = new Image();
        img.onload = () => {
          setNaturalRatios((r) => ({ ...r, [globalIdx]: img.naturalWidth / img.naturalHeight }));
        };
        img.src = preview;
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (cropIdx >= idx && cropIdx > 0) setCropIdx((c) => c - 1);
  };

  const updateCrop = (idx: number, crop: CropState) => {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, crop } : img)));
  };

  // --- Steps ---
  const canGoNext = step === 1 ? images.length > 0 : true;

  const goNext = () => {
    if (step === 1 && canGoNext) setStep(2);
    else if (step === 2) setStep(3);
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  // --- Submit ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) { setError("Add at least one photo"); return; }
    const form = e.currentTarget;
    setIsPending(true);
    setError("");
    try {
      const urls = await Promise.all(images.map((img) => uploadToCloudinary(img.file)));
      const crops = images.map((img) => ({
        ar: aspectRatio,
        s: img.crop.scale,
        x: img.crop.offsetX,
        y: img.crop.offsetY,
      }));
      const formData = new FormData(form);
      formData.set("images", JSON.stringify({ v: 2, urls, crops }));
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg md:max-w-2xl rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg)] to-[var(--bg-soft)] shadow-2xl shadow-black/40 px-6 pt-5 pb-4 max-h-[calc(100dvh-4rem)] overflow-hidden"
            >
              <button
                onClick={close}
                disabled={isPending}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)] disabled:opacity-50"
              >
                <X size={14} />
              </button>

              {/* Title row */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_rgba(168,141,114,0.3)]" />
                <span className="text-xs font-medium uppercase tracking-[.2em] text-[var(--muted)]/40">
                  {step === 1 && "Photos"}
                  {step === 2 && "Crop"}
                  {step === 3 && "Details"}
                </span>
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_rgba(168,141,114,0.3)]" />
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {([1, 2, 3] as Step[]).map((s) => (
                  <StepDot key={s} active={step === s} done={step > s} />
                ))}
              </div>
                {/* ─── STEP 1: Upload ─── */}
                {step === 1 && (
                  <div className="flex flex-col gap-3">
                    {/* Upload area */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-soft)]/20 p-8 text-[var(--muted)]/40 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]/10 hover:text-[var(--accent)]/60"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)]/20 ring-1 ring-[var(--accent)]/10">
                        <ImagePlus size={20} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-[var(--muted)]/60">Tap to choose photos</p>
                        <p className="mt-0.5 text-xs">or drag them here</p>
                      </div>
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Thumbnails */}
                    {images.length > 0 && (
                      <div>
                        <p className="mb-3 text-xs text-[var(--muted)]/40 uppercase tracking-wider">
                          {images.length}/5 selected
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {images.map((img, i) => (
                            <div key={i} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]">
                              <div className="flex h-full w-full items-center justify-center text-[var(--muted)]/20">
                                <ImagePlus size={24} />
                              </div>
                              <img
                                src={img.preview}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={() => setImgErrors((s) => new Set(s).add(i))}
                                style={imgErrors.has(i) ? { display: "none" } : undefined}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-transform hover:scale-110"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          ))}
                          {images.length < 5 && (
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] text-[var(--muted)]/15 transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]/30"
                            >
                              <ImagePlus size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Aspect ratio */}
                    <div>
                      <p className="mb-3 text-xs text-[var(--muted)]/40 uppercase tracking-wider">Aspect ratio</p>
                      <div className="flex gap-2">
                        {ASPECTS.map((ar) => (
                          <button
                            key={ar}
                            type="button"
                            onClick={() => setAspectRatio(ar)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                              aspectRatio === ar
                                ? "border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_12px_rgba(168,141,114,0.1)]"
                                : "border-[var(--border)] bg-[var(--bg-soft)]/50 text-[var(--muted)]/40 hover:border-[var(--accent)]/20 hover:text-[var(--accent)]/50"
                            }`}
                          >
                            {aspectRatio === ar && <Check size={12} />}
                            {ar === "1:1" && <><Square size={14} /> Square</>}
                            {ar === "4:5" && <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0"><rect x="3" y="1" width="8" height="12" rx="1" /></svg> Portrait</>}
                            {ar === "free" && <><Maximize size={14} /> Free</>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 2: Crop ─── */}
                {step === 2 && images.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const img = images[cropIdx];
                      if (!img) return null;
                      if (imgErrors.has(cropIdx)) {
                        return (
                          <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--bg-soft)] text-center ring-1 ring-[var(--border)]" style={{ aspectRatio: aspectRatio === "1:1" ? "1/1" : aspectRatio === "4:5" ? "4/5" : naturalRatios[cropIdx] ? `${naturalRatios[cropIdx]}` : "4/5", maxHeight: "55dvh" }}>
                            <ImagePlus size={28} className="text-[var(--muted)]/15" />
                            <p className="text-sm text-[var(--muted)]/25">Preview not available</p>
                            <p className="text-xs text-[var(--muted)]/15">Auto-cropped to {aspectRatio === "1:1" ? "Square" : aspectRatio === "4:5" ? "Portrait" : "Free"}</p>
                          </div>
                        );
                      }
                      return (
                        <ImageCropper
                          key={cropIdx}
                          src={img.preview}
                          aspectRatio={aspectRatio}
                          naturalRatio={naturalRatios[cropIdx]}
                          crop={img.crop}
                          onChange={(c) => updateCrop(cropIdx, c)}
                        >
                          {aspectRatio !== "free" && (
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10">
                              <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.15)_100%)]" />
                            </div>
                          )}
                        </ImageCropper>
                      );
                    })()}

                    {!imgErrors.has(cropIdx) && (
                    <div className="flex items-center gap-3 px-1">
                      <span className="text-xs text-[var(--muted)]/40">-</span>
                      <input
                        type="range"
                        min="100"
                        max="500"
                        value={Math.round((images[cropIdx]?.crop.scale ?? 1) * 100)}
                        onChange={(e) => {
                          const val = Number(e.target.value) / 100;
                          updateCrop(cropIdx, { ...images[cropIdx].crop, scale: val });
                        }}
                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[var(--border)] accent-[var(--accent)]"
                      />
                      <span className="text-xs text-[var(--muted)]/40">+</span>
                    </div>
                    )}

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCropIdx(i)}
                            className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                              i === cropIdx ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/30" : "border-transparent opacity-50 hover:opacity-80"
                            }`}
                            style={{ width: 48, height: 48 }}
                          >
                            <div className="flex h-full w-full items-center justify-center text-[var(--muted)]/20">
                              <ImagePlus size={16} />
                            </div>
                            <img
                              src={img.preview}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                              onError={() => setImgErrors((s) => new Set(s).add(i))}
                              style={imgErrors.has(i) ? { display: "none" } : undefined}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 3: Form ─── */}
                {step === 3 && (
                  <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="flex flex-col gap-3 md:col-span-2">
                        <input
                          required
                          name="title"
                          disabled={isPending}
                          placeholder="Coffee date"
                          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-3 text-sm outline-none placeholder:text-[var(--muted)]/25 transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] disabled:opacity-50"
                        />
                      </div>

                      <textarea
                        name="description"
                        disabled={isPending}
                        placeholder="What happened? Tell the story..."
                        className="h-24 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-3 text-sm outline-none placeholder:text-[var(--muted)]/25 transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] resize-none disabled:opacity-50"
                      />

                      <div className="flex flex-col gap-3">
                        <div className="relative">
                          <MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)]/30" />
                          <input
                            name="location"
                            disabled={isPending}
                            placeholder="Where was this?"
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] pl-11 pr-5 py-3 text-sm outline-none placeholder:text-[var(--muted)]/25 transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] disabled:opacity-50"
                          />
                        </div>

                        <input
                          required
                          type="date"
                          name="memoryDate"
                          disabled={isPending}
                          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-5 py-3 text-sm outline-none transition-all focus:border-[var(--accent)]/50 focus:bg-[var(--bg)] focus:shadow-[0_0_20px_rgba(168,141,114,0.06)] disabled:opacity-50 [color-scheme:dark]"
                        />

                        <div className="flex items-center gap-2.5 rounded-xl bg-[var(--bg-soft)]/50 px-4 py-3 text-xs text-[var(--muted)]/40">
                          <ImagePlus size={13} />
                          {images.length} photo{images.length > 1 ? "s" : ""} · {aspectRatio === "1:1" ? "Square" : aspectRatio === "4:5" ? "Portrait" : "Free"}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2.5 rounded-2xl bg-red-500/10 px-5 py-3.5 text-sm text-red-400 ring-1 ring-red-500/20"
                      >
                        <span className="shrink-0">!</span>
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={isPending}
                      className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/90 px-6 py-3.5 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_30px_rgba(168,141,114,0.3)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg)] border-t-transparent" />
                          Uploading...
                        </span>
                      ) : "Save Memory"}
                    </button>
                  </form>
                )}

              <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] mt-4 pt-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={isPending}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--muted)]/60 transition-all hover:bg-[var(--bg-soft)] hover:text-[var(--text)] disabled:opacity-50"
                  >
                    <ChevronLeft size={15} />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canGoNext || isPending}
                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/90 px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
