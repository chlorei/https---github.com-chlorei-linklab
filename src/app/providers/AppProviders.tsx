"use client";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { SessionProvider, SessionLite } from "@/app/providers/SessionProvider";

export default function AppProviders({
  initialSession,
  children,
}: { initialSession: SessionLite; children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider initialSession={initialSession}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}