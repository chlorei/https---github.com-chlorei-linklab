"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../ProjectModal/ProjectModal";
import ActivityChart from "../ActivityChart/ActivityChart";
import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";
import colorMap from "@/app/utils/colorMap";
import { SHORT_DOMAIN } from "@/app/utils/shortDomain";
import type { LinkItem } from "@/lib/services/link.service";
import type { ProjectItem } from "@/lib/services/project.service";
import type { ActivityPoint } from "@/lib/services/analytics.service";

type ColorName = keyof typeof colorMap;
const COLOR_NAMES = Object.keys(colorMap) as ColorName[];

type ProjectCardProps = {
  project: ProjectItem;
  links: LinkItem[];
  unassignedLinks: LinkItem[];
  activity: ActivityPoint[];
};

function toColorName(value: string): ColorName {
  return value in colorMap ? (value as ColorName) : "mint";
}

// lighten (+) / darken (-) a hex color
function shadeHex(hex: string, percent: number) {
  const m = hex.replace("#", "");
  if (![3, 6].includes(m.length)) return hex;
  const full = m.length === 3 ? m.split("").map((ch) => ch + ch).join("") : m;
  const comp = (i: number) => {
    const v = parseInt(full.slice(i, i + 2), 16);
    const nv = Math.min(255, Math.max(0, Math.round(v + (percent / 100) * 255)));
    return nv.toString(16).padStart(2, "0");
  };
  return `#${comp(0)}${comp(2)}${comp(4)}`;
}

async function request(url: string, init: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data;
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex-1 min-w-[180px] rounded-2xl border bg-white dark:bg-neutral-900 p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-4xl font-bold tracking-tight tabular-nums">{value}</div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2";

export default function ProjectCard({ project, links, unassignedLinks, activity }: ProjectCardProps) {
  const router = useRouter();
  const projectId = project._id;

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [colorName, setColorName] = useState<ColorName>(toColorName(project.color));
  const [newUrl, setNewUrl] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // keep the edit form in sync after router.refresh()
  useEffect(() => {
    setTitle(project.title);
    setDescription(project.description);
    setColorName(toColorName(project.color));
  }, [project.title, project.description, project.color]);

  // closing discards unsaved edits
  const closeModal = () => {
    setOpen(false);
    setTitle(project.title);
    setDescription(project.description);
    setColorName(toColorName(project.color));
    setNewUrl("");
    setSelectedIds([]);
    setError(null);
  };

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const avgClicks = links.length ? (totalClicks / links.length).toFixed(2) : "0";
  const mainHex = colorMap[toColorName(project.color)].mainColor;
  const editHex = colorMap[colorName].mainColor;

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const handleSave = async () => {
    const ok = await run(() =>
      request("/api/projects/update", {
        method: "PATCH",
        body: JSON.stringify({ projectId, title, description, color: colorName }),
      })
    );
    if (ok) setOpen(false);
  };

  const handleDeleteProject = () => {
    setMenuOpen(false);
    if (!window.confirm(`Delete project "${project.title}"? Its links will be kept.`)) return;
    run(() => request("/api/projects/delete", { method: "POST", body: JSON.stringify({ projectId }) }));
  };

  const handleCreateLink = async () => {
    const ok = await run(() =>
      request("/api/links/create", { method: "POST", body: JSON.stringify({ originalUrl: newUrl, projectId }) })
    );
    if (ok) setNewUrl("");
  };

  const handleAddSelected = async () => {
    const ok = await run(() =>
      request(`/api/links/addToProject?projectid=${encodeURIComponent(projectId)}`, {
        method: "POST",
        body: JSON.stringify({ linkIds: selectedIds }),
      })
    );
    if (ok) setSelectedIds([]);
  };

  const handleDetach = (linkId: string) =>
    run(() => request(`/api/links/deleteFromProject?id=${encodeURIComponent(linkId)}`, { method: "DELETE" }));

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        tabIndex={0}
        role="button"
        aria-label={`Open project ${project.title}`}
        className="relative flex flex-col w-full cursor-pointer rounded-2xl border border-gray-200/80 dark:border-white/10
                   bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-200 ease-out
                   hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
      >
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0" style={{ backgroundColor: mainHex }}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{ fill: shadeHex(mainHex, -35) }}>
                <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h4.086c.464 0 .908.184 1.236.512l1.172 1.176c.328.329.772.512 1.236.512H19.25A1.75 1.75 0 0 1 21 9v8.25A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{project.title}</h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
              )}
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                type="button"
                className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:text-gray-400"
                aria-label="Project menu"
                aria-expanded={menuOpen}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute top-full right-0 mt-2 z-50 w-40 rounded-xl border border-border bg-background/90 backdrop-blur-md shadow-lg p-2 text-sm"
                >
                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    className="w-full px-3 py-2 text-left hover:bg-accent rounded-lg text-red-500 hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="inline-flex items-center gap-1.5">
              <span className="tabular-nums font-medium">{links.length}</span>
              <span>links</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="tabular-nums font-medium">{totalClicks.toLocaleString()}</span>
              <span>clicks</span>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={closeModal} title={project.title}>
        <div className="space-y-6">
          {description && <p className="text-gray-500 -mt-2">{description}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Links" value={links.length} />
            <StatCard title="Total Clicks" value={totalClicks} />
            <StatCard title="Avg. Clicks/Link" value={avgClicks} />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

          <section className="rounded-2xl border p-4">
            <h3 className="text-lg font-semibold mb-4">Project Settings</h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Name"
                autoComplete="off"
                maxLength={100}
                className={inputClass}
              />
              <div className="min-w-[220px]">
                <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
                  Project Color
                  <span className="inline-block size-3 rounded-full border" style={{ backgroundColor: editHex }} />
                </div>
                <ColorPicker value={colorName} onChange={(c) => setColorName(c as ColorName)} colors={COLOR_NAMES} />
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              autoComplete="off"
              maxLength={1000}
              className="mt-4 min-h-[100px] max-h-[320px] w-full rounded-2xl border px-4 py-2 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2 resize-y"
            />
          </section>

          <section className="rounded-2xl border p-4">
            <h3 className="text-lg font-semibold mb-1">Clicks Over Time</h3>
            <p className="text-sm text-gray-500 mb-4">Daily clicks for the last 7 days</p>
            <ActivityChart data={activity} />
          </section>

          <section className="rounded-2xl border p-4">
            <h3 className="text-lg font-semibold mb-3">Add New Link</h3>
            <form
              className="flex flex-col gap-3 md:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateLink();
              }}
            >
              <input
                value={newUrl}
                type="text"
          inputMode="url"
          autoCapitalize="off"
          spellCheck={false}
                required
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://your-long-url.com"
                className={inputClass}
              />
              <button
                type="submit"
                disabled={busy || !newUrl.trim()}
                className="h-11 px-5 rounded-2xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
              >
                Add
              </button>
            </form>
          </section>

          {unassignedLinks.length > 0 && (
            <section className="rounded-2xl border p-4">
              <h3 className="text-lg font-semibold">Add From Existing Links</h3>
              <p className="text-sm text-gray-500">Pick links that aren&apos;t in any project yet.</p>

              <div className="mt-4 rounded-xl border overflow-hidden">
                {unassignedLinks.map((r) => (
                  <label
                    key={r._id}
                    className="grid grid-cols-[32px_1.2fr_2fr_60px] gap-4 items-center px-4 py-3 text-sm border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r._id)}
                      onChange={() => toggle(r._id)}
                      className="size-4"
                    />
                    <span className="font-medium truncate">{SHORT_DOMAIN}/{r.shortId}</span>
                    <span className="truncate text-gray-600">{r.originalUrl}</span>
                    <span className="text-right tabular-nums">{r.clicks}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="rounded-lg border px-2 py-1 text-sm text-gray-500">{selectedIds.length} selected</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="px-4 py-2 rounded-2xl border hover:bg-gray-50 transition w-full sm:w-auto"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    disabled={busy || selectedIds.length === 0}
                    onClick={handleAddSelected}
                    className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/90 transition w-full sm:w-auto disabled:opacity-60"
                  >
                    Add Selected
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-2xl border overflow-hidden">
            <div className="p-4 text-lg font-semibold">Links in this Project ({links.length})</div>
            {links.length === 0 ? (
              <p className="border-t px-4 py-6 text-sm text-gray-500">No links yet.</p>
            ) : (
              <div className="border-t">
                {links.map((r) => (
                  <div
                    key={r._id}
                    className="grid grid-cols-[1.2fr_2fr_60px_30px] gap-4 items-center px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <a href={`/${r.shortId}`} target="_blank" rel="noopener noreferrer" className="font-medium truncate">
                      {SHORT_DOMAIN}/{r.shortId}
                    </a>
                    <span className="truncate text-gray-600">{r.originalUrl}</span>
                    <span className="text-right tabular-nums">{r.clicks}</span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDetach(r._id)}
                      aria-label="Remove from project"
                      title="Remove from project"
                      className="flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition h-6 w-6"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-end gap-3 pb-1">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-2xl border hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              Close
            </button>
            <button
              type="button"
              disabled={busy || !title.trim()}
              onClick={handleSave}
              className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
