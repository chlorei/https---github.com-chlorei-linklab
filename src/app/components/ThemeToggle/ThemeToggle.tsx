"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeCtx } from "@/app/providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useThemeCtx();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={`grid size-9 place-items-center rounded-control text-ink-soft transition-colors hover:bg-sunken hover:text-ink ${className}`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
