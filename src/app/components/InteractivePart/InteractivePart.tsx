"use client";
import { useState } from "react";

export default function InteractivePart() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setShortId(null);

    const value = url.trim();
    if (!value) return setErr("Введите URL");

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // важно!
        body: JSON.stringify({ originalUrl: value }),
      });

      // пробуем распарсить:
      // пробуем распарсить:
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        // если сервер вернул не-JSON, покажем текст
        const text = await res.text();
        throw new Error(`Bad JSON (${res.status}): ${text}`);
      }

      // теперь сужаем тип — проверяем, что это объект
      if (
        !data ||
        typeof data !== "object" ||
        !("ok" in data)
      ) {
        throw new Error("Некорректный ответ сервера");
      }

      // приводим к ожидаемому виду
      const parsed = data as { ok: boolean; link?: { shortId?: string }; error?: string };

      if (!res.ok || !parsed.ok || !parsed.link?.shortId) {
        throw new Error(parsed.error || `HTTP ${res.status}`);
      }

      setShortId(parsed.link.shortId);;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErr(msg || "Ошибка");
      console.error("create link error:", err);
    } finally {
      setLoading(false);
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shortUrl = shortId ? `${origin}/${shortId}` : "";

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

      {shortId && (
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