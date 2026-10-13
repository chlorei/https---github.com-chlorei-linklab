"use client";
import { useEffect, useMemo, useState } from "react";
import colorMap from "@/app/utils/colorMap";
import { useRouter } from "next/navigation";
import { useSessionLite } from "@/app/providers/SessionProvider";

type ColorName = keyof typeof colorMap;
type ProjectLite = { _id: string; title: string; color?: ColorName };

export default function InteractivePart() {
  const { session } = useSessionLite();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [withProject, setWithProject] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!withProject) return;
    const ac = new AbortController();

    (async () => {
      setProjectsLoading(true);
      try {
        const res = await fetch("/api/projects", { cache: "no-store", signal: ac.signal });
        const data = await res.json().catch(() => null);
        const list: ProjectLite[] = res.ok && Array.isArray(data?.projects) ? data.projects : [];
        setProjects(list);
        setProjectId((current) => current ?? list[0]?._id ?? null);
      } catch {
        if (ac.signal.aborted) return;
        setProjects([]);
        setProjectId(null);
      } finally {
        if (!ac.signal.aborted) setProjectsLoading(false);
      }
    })();

    return () => ac.abort();
  }, [withProject]);

  const currentColor = useMemo(() => {
    const p = projects.find((x) => x._id === projectId);
    const name = p?.color;
    return name && colorMap[name]?.mainColor ? colorMap[name].mainColor : "#D1D5DB";
  }, [projects, projectId]);

  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setCopied(false);

    const value = url.trim();
    if (!value) return setError("Please enter a valid URL.");
    if (withProject && !projectId) return setError("Please choose a project.");

    setLoading(true);
    try {
      const body = { originalUrl: value, projectId: withProject ? projectId : null };

      const res = await fetch("/api/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok || !data?.shortUrl) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      setShortUrl(data.shortUrl);
      // signed-out visitors see the new link in "Your links on this device"
      if (!session) router.refresh();
      setUrl("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {session?.id && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">
              {withProject ? "Adding to a project" : "Without project"}
            </label>
            <button
              type="button"
              onClick={() => {
                if (withProject) setProjectId(null);
                setWithProject(!withProject);
              }}
              className="rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              {withProject ? "Switch to No Project" : "Add to Project"}
            </button>
          </div>
        )}

        {session?.id && withProject && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Select project</label>
            <div className="relative">
              <select
                value={projectId ?? ""}
                onChange={(e) => setProjectId(e.target.value || null)}
                disabled={projectsLoading}
                className="w-full rounded-2xl border p-3 h-[48px] outline-none transition
                           appearance-none focus:ring-2 focus:ring-black/60 focus:ring-offset-2 disabled:opacity-60"
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

              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 rounded-full border shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          </div>
        )}

        <input
          type="text"
          inputMode="url"
          autoCapitalize="off"
          spellCheck={false}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com/your-long-link"
          className="w-full text-primary-text rounded-2xl border p-3 h-[48px] outline-none transition
                     focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
          required
        />

        <button
          type="submit"
          disabled={loading || !url.trim() || (withProject && !projectId)}
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
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shortUrl);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
            className="rounded-xl border px-3 py-2 text-sm transition text-primary-text
                       hover:bg-hover-button-bg hover:text-hover-button-text"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}