"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Shown before the title, e.g. a project color dot. */
  leading?: React.ReactNode;
  size?: "md" | "lg";
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, leading, size = "lg", children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  // latest onClose without re-running the open/close effect (callers pass inline functions)
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    // move focus into the dialog unless something inside is autofocused
    requestAnimationFrame(() => {
      if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus();
    });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!mounted || !open) return null;

  // React events bubble through portals to the React parent, so stop them here
  // to keep clicks inside the modal from reaching whatever rendered it.
  return createPortal(
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onKeyDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-6"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-panel border border-line bg-surface text-ink shadow-overlay outline-none animate-[modalIn_0.22s_ease-out] sm:rounded-panel ${
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-lg"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
          {leading}
          <h2 className="min-w-0 flex-1 truncate text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-control text-ink-soft hover:bg-sunken hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
