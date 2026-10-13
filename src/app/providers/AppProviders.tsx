"use client";
import { useEffect } from "react";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { SessionProvider, SessionLite } from "@/app/providers/SessionProvider";

export default function AppProviders({
  initialSession,
  children,
}: { initialSession: SessionLite; children: React.ReactNode }) {
  // lets the server bucket analytics by the viewer's local day
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && !document.cookie.includes(`tz=${encodeURIComponent(tz)}`)) {
      document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  return (
    <ThemeProvider>
      <SessionProvider initialSession={initialSession}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}