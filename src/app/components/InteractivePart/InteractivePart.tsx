"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check, Link2, ChevronDown } from "lucide-react";
import colorMap from "@/app/utils/colorMap";

type Session = { id?: string };
type ColorName = keyof typeof colorMap;
type ProjectLite = { _id: string; title: string; color?: ColorName };
type CreateLinkBody = {
  originalUrl: string;
  userId: string | null;
  projectId?: string;
};

export default function InteractivePart() {
  const [session, setSession] = useState<Session | null>(null);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [withProject, setWithProject] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        setSession(res.ok && data?.ok ? (data.user as Session) : null);
      } catch {
        setSession(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (!withProject) return;
    const ac = new AbortController();
    let alive = true;

    (async () => {
      try {
        setProjectsLoading(true);
        const res = await fetch("/api/projects", {
          cache: "no-store",
          signal: ac.signal,
        });
        if (!alive) return;

        if (!res.ok) {
          setProjects([]);
          setProjectId(null);
          return;
        }

        const data = await res.json().catch(() => ({}));
        const list: ProjectLite[] = Array.isArray(data?.projects)
          ? data.projects
          : [];
        setProjects(list);

        if (!projectId && list.length > 0) {
          setProjectId(list[0]._id);
        }
      } catch {
        if (!alive) return;
        setProjects([]);
        setProjectId(null);
      } finally {
        if (alive) setProjectsLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [projectId, withProject]);

  const currentColor = useMemo(() => {
    const p = projects.find((x) => x._id === projectId);
    const name = p?.color;
    return name && colorMap[name]?.mainColor
      ? colorMap[name].mainColor
      : "#D1D5DB";
  }, [projects, projectId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);

    const value = url.trim();
    if (!value) return setError("Please enter a valid URL.");
    if (withProject && !projectId) return setError("Please choose a project.");

    setLoading(true);
    try {
      const body: CreateLinkBody = {
        originalUrl: value,
        userId: session?.id || null,
        projectId: projectId || undefined,
      };
      if (withProject && projectId) body.projectId = projectId;

      const res = await fetch("/api/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(async () => {
        const text = await res.text();
        throw new Error(`Bad JSON (${res.status}): ${text}`);
      });

      if (!res.ok || !data?.ok || !data?.shortUrl) {
        throw new Error(
          data?.error || `Request failed with status ${res.status}`
        );
      }

      setShortUrl(data.shortUrl);
      setUrl("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Create link error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Project toggle */}
        {session?.id && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-3">
            <span className="text-sm text-muted-foreground">
              {withProject ? "Adding to project" : "No project selected"}
            </span>
            <button
              type="button"
              onClick={() => {
                setWithProject((v) => {
                  if (v) setProjectId(null);
                  return !v;
                });
              }}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition-all hover:bg-secondary"
            >
              {withProject ? "Remove" : "Add to Project"}
            </button>
          </div>
        )}

        {/* Project selector */}
        {session?.id && withProject && (
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select project
            </label>
            <div className="relative">
              <select
                value={projectId ?? ""}
                onChange={(e) => setProjectId(e.target.value || null)}
                disabled={projectsLoading}
                className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 pr-10 text-card-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
              >
                <option value="">
                  {projectsLoading ? "Loading projects..." : "Select project..."}
                </option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: currentColor }}
                />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* URL Input */}
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourlonglink.com"
            className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !url.trim() || (withProject && !projectId)}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Shorten Link"}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Success result */}
      {shortUrl && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            {shortUrl}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
