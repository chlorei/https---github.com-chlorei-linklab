"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { useSessionLite } from "@/app/providers/SessionProvider";
import { Button } from "@/app/components/UI/Button/Button";
import { SHORT_DOMAIN } from "@/app/utils/shortDomain";
import { displayUrl } from "@/app/utils/displayUrl";

type ProjectLite = { _id: string; title: string };
type Result = { shortUrl: string; shortId: string; originalUrl: string };

/** The shorten form: paste a URL, get a short link back. */
export default function InteractivePart() {
  const { session } = useSessionLite();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (!session) return;
    const ac = new AbortController();
    fetch("/api/projects", { cache: "no-store", signal: ac.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProjects(Array.isArray(data?.projects) ? data.projects : []))
      .catch(() => {});
    return () => ac.abort();
  }, [session]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;

    setError(null);
    setCopied(false);
    setLoading(true);
    try {
      const res = await fetch("/api/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: value, projectId: projectId || null }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Couldn't shorten the link (error ${res.status}).`);

      setResult({ shortUrl: data.shortUrl, shortId: data.link.shortId, originalUrl: data.link.originalUrl });
      setUrl("");
      // refresh server-rendered lists (e.g. "Your links on this device")
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't copy. Select the link and copy it manually.");
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="long-url" className="sr-only">
          Long URL
        </label>
        <div className="flex flex-col gap-2 rounded-[0.875rem] border border-line-strong bg-surface p-1.5 transition-colors focus-within:border-link focus-within:ring-4 focus-within:ring-link/12 sm:flex-row">
          <input
            ref={inputRef}
            id="long-url"
            type="text"
            inputMode="url"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a long link, e.g. example.com/your-long-link"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "shorten-error" : undefined}
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none"
          />
          <Button type="submit" variant="accent" size="lg" disabled={loading || !url.trim()} className="sm:w-auto">
            {loading ? "Shortening…" : "Shorten"}
          </Button>
        </div>

        {session && projects.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <label htmlFor="project">Add to project</label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-8 rounded-control border border-line-strong bg-surface px-2 text-sm text-ink focus:border-link focus:outline-none"
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>

      {error && (
        <p id="shorten-error" role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      {result && (
        <div key={result.shortId} className="mt-8" aria-live="polite">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="short-link animate-link-in text-[clamp(1.5rem,5vw,2.75rem)] leading-none font-medium tracking-tight"
            >
              {SHORT_DOMAIN}/{result.shortId}
            </a>
            <Button variant={copied ? "secondary" : "primary"} onClick={copy} aria-live="polite">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <p className="mt-3 truncate text-sm text-ink-soft">
            Opens <span className="text-ink">{displayUrl(result.originalUrl)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
