"use client";
import { useEffect, useState } from "react";

type Session = {
  id?: string;
};

export default function InteractivePart() {
  const [session, setSession] = useState<Session | null>(null);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      console.log("Session data:", data.user);
      if (res.ok && data.ok) setSession(data.user as Session);
      else setSession(null);
    } catch {
      setSession(null);
    }
  })();
}, []);

  async function getSessionSafe(): Promise<Session | null> {
  if (session !== null) return session; 
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data = await res.json().catch(() => null);
    return res.ok && data?.ok ? (data.user as Session) : null;
  } catch {
    return null;
  }
}


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);

    const value = url.trim();
    if (!value) return setError("Please enter a valid URL.");

    setLoading(true);
    try {
      const session = await getSessionSafe();
      // await fetchVisits();
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: value, userId: session?.id ?? null}),
      });

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(`Bad JSON (${res.status}): ${text}`);
      }

      if (!data || typeof data !== "object" || !("ok" in data)) {
        throw new Error("Invalid server response.");
      }

      const parsed = data as { ok: boolean; shortUrl?: string; error?: string };

      if (!res.ok || !parsed.ok || !parsed.shortUrl) {
        throw new Error(parsed.error || `Request failed with status ${res.status}`);
      }

      setShortUrl(parsed.shortUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Something went wrong.");
      console.error("Create link error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourlonglink.com"
          className="w-full text-primary-text rounded-2xl border p-3 h-[48px] outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full text-primary-text rounded-2xl border-2 px-5 py-3 font-semibold transition
                     hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Get better link now!"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {shortUrl && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border p-3 shadow-sm">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate text-gray-500 hover:text-gray-300 transition font-medium lowercase"
          >
            {shortUrl}
          </a>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="rounded-xl border px-3 py-2 text-sm transition text-primary-text
                       hover:bg-hover-button-bg hover:text-hover-button-text"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}