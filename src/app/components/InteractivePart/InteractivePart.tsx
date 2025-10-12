"use client";
import { useState } from "react";

export default function InteractivePart() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null); // 👈 храним полный URL
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setShortUrl(null);

    const value = url.trim();
    if (!value) return setErr("Введите URL");

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: value }),
      });

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(`Bad JSON (${res.status}): ${text}`);
      }

      if (!data || typeof data !== "object" || !("ok" in data)) {
        throw new Error("Некорректный ответ сервера");
      }
      const parsed = data as { ok: boolean; shortUrl?: string; error?: string };

      if (!res.ok || !parsed.ok || !parsed.shortUrl) {
        throw new Error(parsed.error || `HTTP ${res.status}`);
      }

      setShortUrl(parsed.shortUrl); // 👈 готовый полный URL с правильным доменом
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErr(msg || "Ошибка");
      console.error("create link error:", err);
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
          className="w-full rounded-2xl border p-3 h-[48px] outline-none"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full rounded-2xl border-2 px-5 py-3 font-semibold transition
                     hover:bg-black hover:text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Get better link now!"}
        </button>
      </form>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      {shortUrl && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border p-3">
          <a href={shortUrl} target="_blank" rel="noreferrer" className="truncate text-blue-600 underline">
            {shortUrl}
          </a>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}