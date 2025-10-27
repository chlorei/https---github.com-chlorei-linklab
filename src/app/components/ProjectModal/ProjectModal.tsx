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

  if (!mounted || !open) return null;


  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-[90%] max-w-4xl max-h-[100vh] overflow-y-auto
          bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100
          rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10
          p-8 animate-[modalIn_0.25s_ease-out_forwards]
        "
      >
        {/* верхняя панель */}
        <div className="flex items-start justify-between mb-4">

          <div>
            <h1 className="text-2xl">{title}</h1>
          </div>
          
          {/* <EditInput title={title ?? ""} /> */}
          {/* <input className="p-3 text-2xl font-semibold rounded-2xl" type="text" value={title}/> */}
          {/* {title && <h2 className="text-2xl font-semibold">{title}</h2>} */}
          <button
            onClick={onClose}
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