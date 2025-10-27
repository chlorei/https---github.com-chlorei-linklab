// components/FolderCard.tsx
import React, { useEffect, useState } from "react";
// import Link from "next/link";
import Modal from "../ProjectModal/ProjectModal";
import ModalFeatureCard from "../UI/ModalFeatureCard/ModalFeatureCard";
import DefaultInput from "../UI/DefaultInput/DefaultInput";
// import ColorPicker from "../UI/ColorPicker/ColorPicker";

type FolderCardProps = {
  href?: string;
  title: string;
  description?: string;
  linksCount?: number;
  clicks?: number;
  color?: keyof typeof colorMap;
};

const colorMap = {
  blue: {
    bar: "from-[#A5D8FF] to-[#74C0FC]",
    iconBg: "bg-[#A5D8FF]/40",
    icon: "fill-[#1C7ED6]",
  },
  peach: {
    bar: "from-[#FFD8A8] to-[#FFC078]",
    iconBg: "bg-[#FFD8A8]/40",
    icon: "fill-[#E8590C]",
  },
  lavender: {
    bar: "from-[#D0BFFF] to-[#B197FC]",
    iconBg: "bg-[#D0BFFF]/40",
    icon: "fill-[#6741D9]",
  },
  beige: {
    bar: "from-[#FFE8CC] to-[#FFD8A8]",
    iconBg: "bg-[#FFE8CC]/40",
    icon: "fill-[#D9480F]",
  },
  pink: {
    bar: "from-[#F3C0C6] to-[#FAA2C1]",
    iconBg: "bg-[#F3C0C6]/40",
    icon: "fill-[#D6336C]",
  },
  yellow: {
    bar: "from-[#FFF3BF] to-[#FFE066]",
    iconBg: "bg-[#FFF3BF]/40",
    icon: "fill-[#F08C00]",
  },
  teal: {
    bar: "from-[#96E6B3] to-[#63E6BE]",
    iconBg: "bg-[#96E6B3]/40",
    icon: "fill-[#0CA678]",
  },
  mint: {
    bar: "from-[#B2F2BB] to-[#96F2D7]",
    iconBg: "bg-[#B2F2BB]/40",
    icon: "fill-[#20C997]",
  },
  gray: {
    bar: "from-[#C5D8E8] to-[#ADB5BD]",
    iconBg: "bg-[#C5D8E8]/40",
    icon: "fill-[#495057]",
  },
} as const;

export default function FolderCard({
  title,
  description,
  linksCount = 0,
  clicks = 0,
  color = "mint",
}: FolderCardProps) {


  // const [colorSwitcher, setColorSwitcher] = useState<keyof typeof colorMap>(color);
  const c = colorMap[color];
  const colors = Object.values(colorMap).map(col => col.iconBg.match(/#([0-9A-Fa-f]{3,6})/)?.[0] ?? "");
  const [open, setOpen] = useState<boolean>(false);
  console.log("1:", colors[0]);
  console.log("2:", colors[1]);
  console.log("3:", colors[2]);
  console.log("4:", colors[3]); 

  // ESC — закрытие
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  
  return (
    <div
      onClick={() => setOpen(true)}
      className="
        group relative flex flex-col
        w-[280px] sm:w-[300px] lg:w-[320px] 
        rounded-2xl border border-gray-200/80 dark:border-white/10
        bg-white dark:bg-neutral-900
        shadow-sm hover:shadow-md transition-all duration-300 ease-out
        hover:-translate-y-0.5 overflow-hidden
      "
      role="article"
      aria-label={title}
    >
      {/* top color bar */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.bar}`} />

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="flex items-start gap-3">
          {/* folder icon bubble */}
          <div className={`h-10 w-10 ${c.iconBg} rounded-xl grid place-items-center shrink-0`}>
            <svg width="22" height="22" viewBox="0 0 24 24" className={c.icon} aria-hidden="true">
              <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h4.086c.464 0 .908.184 1.236.512l1.172 1.176c.328.329.772.512 1.236.512H19.25A1.75 1.75 0 0 1 21 9v8.25A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* menu button */}
          <button
            type="button"
            className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700
                       dark:hover:bg-white/5 dark:text-gray-400"
            aria-label="Open folder menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* metrics */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="inline-flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 12h4v8H4v-8Zm6-6h4v14h-4V6Zm6 9h4v5h-4v-5Z" />
            </svg>
            <span className="tabular-nums">{linksCount}</span>
            <span>links</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 16.32-4.9l1.86-1.86v7h-7l2.62-2.62A6 6 0 1 0 18 12h2a8 8 0 1 1-8-8v2A6 6 0 1 0 12 20a6 6 0 0 0 6-6h-2a4 4 0 1 1-4-4v2a2 2 0 1 0 2 2h2a4 4 0 1 1-4 4A8 8 0 0 1 3 12Z" />
            </svg>
            <span className="tabular-nums">{clicks.toLocaleString()}</span>
            <span>clicks</span>
          </div>
        </div>
      </div>

        <Modal open={open} onClose={() => setOpen(false)} title={title}>
            <div className="flex flex-wrap mb-10 gap-5 justify-between">
              <ModalFeatureCard title="Total Links" count={18} image="/icons/x.svg" />
              <ModalFeatureCard title="Total Links" count={18} image="/icons/x.svg" />
              <ModalFeatureCard title="Total Links" count={18} image="/icons/x.svg" />
              
            </div>
            <div className="flex flex-col border p-3 rounded-2xl">
              <h3 className="text-l font-semibold mb-4">Project Settings</h3>
              <DefaultInput name="title" value={title ?? ""}  type="text" placeholder="Title" autoComplete="off" />
              <DefaultInput name="description" value={description ?? ""}  type="text" placeholder="Descriptions" autoComplete="off" />
              {/* <ColorPicker colors={colors} value={color} onChange={setColorSwitcher} className="mt-5" /> */}
            </div>
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Закрыть
          </button>
        </div> */}
      </Modal>  
    </div>
  );
}