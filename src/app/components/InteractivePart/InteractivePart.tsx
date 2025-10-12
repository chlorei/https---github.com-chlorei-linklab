"use client";

import React, { useState } from "react";

const InteractivePart = () => {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setShortId(null);

    // простая проверка URL (даже без http — добавим на бэке normalize при желании)
    if (!url.trim()) {
      setErr("Enter URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Request failed");
      setShortId(data.link.shortId);
    } catch (e: any) {
      setErr(e.message || "Could not create link");
    } finally {
      setLoading(false);
    }
  }

  const shortUrl = shortId ? `${location.origin}/api/r/${shortId}` : "";

  return (
    <div className="w-full max-w-2xl">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="https://yourlonglink.com/blahblah"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-2xl border p-3 h-[48px] outline-none transition
                     focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl border-2 px-5 py-3 font-semibold
                     transition-all duration-300
                     hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-0.5
                     active:translate-y-0 active:shadow-md
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Get better link now!"}
        </button>
      </form>

      {err && (
        <p className="mt-3 text-sm text-red-600">
          {err}
        </p>
      )}

      {shortId && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border p-3">
          <a
            href={shortUrl}
            target="_blank"
            className="truncate text-blue-600 underline underline-offset-4 hover:no-underline"
          >
            {shortUrl}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractivePart;