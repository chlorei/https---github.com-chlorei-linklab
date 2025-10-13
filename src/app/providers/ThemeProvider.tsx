"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // инициализация из localStorage / system
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = saved ?? (sysDark ? "dark" : "light");
    applyTheme(initial);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    // анти-мигание (опционально)
    root.classList.add("theming");
    root.classList.toggle("dark", t === "dark");
    localStorage.setItem("theme", t);
    setThemeState(t);
    requestAnimationFrame(() => root.classList.remove("theming"));
  }

  const setTheme = (t: Theme) => applyTheme(t);
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeCtx() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useThemeCtx must be used within <ThemeProvider>");
  return ctx;
}