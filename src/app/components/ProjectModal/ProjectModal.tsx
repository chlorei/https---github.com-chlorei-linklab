"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
          bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100
          rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10
          p-6 sm:p-8 animate-[modalIn_0.25s_ease-out_forwards]
        "
      >
        <div className="flex items-start justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold break-words">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-800 dark:text-gray-400"
          >
            ✕
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
