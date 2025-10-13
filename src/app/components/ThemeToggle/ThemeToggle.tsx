"use client";
import { useThemeCtx } from "@/app/providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useThemeCtx();
  return (
    <button onClick={toggle} className={`border bg-background text-primary-text rounded-xl px-4 py-2 font-bold ${className}`}>
      {theme === "dark" ? "DARK" : "LIGHT"}
    </button>
  );
}