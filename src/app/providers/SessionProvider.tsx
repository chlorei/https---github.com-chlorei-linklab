// app/providers/SessionProvider.tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SessionLite = { id: string; email?: string|null; name?: string|null } | null;
type Ctx = { session: SessionLite; setSession: (s: SessionLite) => void };

const Ctx = createContext<Ctx | null>(null);

export function SessionProvider({
  initialSession,
  children,
}: {
  initialSession: SessionLite;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<SessionLite>(initialSession);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  const value = useMemo(() => ({ session, setSession }), [session]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSessionLite = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSessionLite must be used within SessionProvider");
  return v;
};