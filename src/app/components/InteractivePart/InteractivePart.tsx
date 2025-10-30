"use client";
import { useEffect, useMemo, useState } from "react";
import colorMap from "@/app/utils/colorMap";

type Session = { id?: string };
type ColorName = keyof typeof colorMap;
type ProjectLite = { id: string; title: string; color?: ColorName };
type CreateLinkBody = {
  originalUrl: string;
  userId: string | null;
  projectId?: string;
};

export default function InteractivePart() {
  // session (нужно только, чтобы показать переключатель)
  const [session, setSession] = useState<Session | null>(null);

  // form state
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // projects
  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [withProject, setWithProject] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  // ---- fetch session (optional UI)
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

  // ---- fetch projects only when "withProject" is ON
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
        const list: ProjectLite[] = Array.isArray(data?.projects) ? data.projects : [];
        setProjects(list);

        // авто-выбор первого проекта при первом включении режима
        if (!projectId && list.length > 0) {
          setProjectId(list[0].id);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withProject]); // намеренно не зависим от session — роут сам читает куку

  // цветная точка выбранного проекта
  const currentColor = useMemo(() => {
    const p = projects.find((x) => x.id === projectId);
    const name = p?.color;
    return name && colorMap[name]?.mainColor ? colorMap[name].mainColor : "#D1D5DB";
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
        const body: CreateLinkBody = { originalUrl: value ,  userId: session?.id || null };
      if (withProject && projectId) body.projectId = projectId; // не отправляем пустые строки

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
        throw new Error(data?.error || `Request failed with status ${res.status}`);
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

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Переключатель режима "с проектом / без проекта" */}
        {session?.id && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">
              {withProject ? "Adding to a project" : "Without project"}
            </label>
            <button
              type="button"
              onClick={() => setWithProject((v) => {
                // при выключении режима — очищаем выбор
                if (v) setProjectId(null);
                return !v;
              })}
              className="rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              {withProject ? "Switch to No Project" : "Add to Project"}
            </button>
          </div>
        )}

        {/* Селект проекта (только если режим включён) */}
        {session?.id && withProject && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Select project</label>
            <div className="relative">
              <select
                value={projectId ?? ""}
                onChange={(e) => setProjectId(e.target.value || null)} // "" → null
                disabled={projectsLoading}
                className="w-full rounded-2xl border p-3 h-[48px] outline-none transition
                           appearance-none focus:ring-2 focus:ring-black/60 focus:ring-offset-2 disabled:opacity-60"
              >
                <option value="">
                  {projectsLoading ? "Loading projects..." : "Select project..."}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              {/* цветовая точка выбранного проекта */}
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 rounded-full border shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          </div>
        )}

        {/* URL input */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourlonglink.com"
          className="w-full text-primary-text rounded-2xl border p-3 h-[48px] outline-none transition
                     focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
          required
        />

        {/* Submit */}
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

      {/* Errors */}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* Result */}
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