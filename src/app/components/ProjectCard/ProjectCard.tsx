// components/FolderCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Modal from "../ProjectModal/ProjectModal";
import colorMap from "@/app/utils/colorMap";

type ColorName = keyof typeof colorMap;

type FolderCardProps = {
  projectId: string;
  href?: string;
  title: string;
  description?: string;
  linksCount?: number;
  clicks?: number;
  color: ColorName; // храним имя цвета
  emptyLinks: { _id: string; shortId: string; originalUrl: string; clicks: number }[];
};

// демо-список




// утилита для затемнения/осветления hex
function shadeHex(hex: string, percent: number) {
  const m = hex.replace("#", "");
  if (![3, 6].includes(m.length)) return hex;
  const full = m.length === 3 ? m.split("").map(ch => ch + ch).join("") : m;
  const comp = (i: number) => {
    const v = parseInt(full.slice(i, i + 2), 16);
    const nv = Math.min(255, Math.max(0, Math.round(v + (percent / 100) * 255)));
    return nv.toString(16).padStart(2, "0");
  };
  return `#${comp(0)}${comp(2)}${comp(4)}`;
}

// свотчи по имени
function ColorSwatchesByName({
  value,
  onChange,
  names,
}: {
  value: ColorName;
  onChange: (c: ColorName) => void;
  names: ColorName[];
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {names.map((name) => {
        const hex = colorMap[name].mainColor;
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            className={`h-10 w-10 rounded-2xl border transition ring-offset-2 focus:outline-none focus:ring-2 focus:ring-black/60 ${
              active ? "ring-2 ring-black/60" : ""
            }`}
            style={{ backgroundColor: hex }}
            aria-pressed={active}
            aria-label={name}
          />
        );
      })}
    </div>
  );
}

export default function ProjectCard({
  projectId,
  title,
  description,
  linksCount = 0,
  clicks = 0,
  color = "blue",
  emptyLinks
}: FolderCardProps) {


  const [links, setLinks] = useState<Array<{
    rank: number;
    index: number;
    _id: string;
    shortId: string;
    originalUrl: string;
    clicks: number;
  }>>([]);
  const [cardTitle, setCardTitle] = useState<string>(title);
  const [cardDescription, setCardDescription] = useState<string>(description ?? "");
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"links" | "analytics">("links");
  const [sortedLinks, setSortedLinks] = useState<typeof links>([]);
  const [sortOption, setSortOption] = useState("most-clicks");
  const [emptyLinksState, setEmptyLinksState] = useState(emptyLinks);



function handleSort(option: string) {
  setSortOption(option);

  setEmptyLinksState(prev => {
    const arr = [...prev];

    switch (option) {
      case "most-clicks":
        return arr.sort((a,b)=> b.clicks - a.clicks);
      case "least-clicks":
        return arr.sort((a,b)=> a.clicks - b.clicks);
      case "az":
        return arr.sort((a,b)=> a.shortId.localeCompare(b.shortId));
      case "za":
        return arr.sort((a,b)=> b.shortId.localeCompare(a.shortId));
      default:
        return arr;
    }
  });
}

useEffect(() => {
  if (!projectId) return;

  const fetchLinks = async () => {
    try {
      const res = await fetch(`/api/links/find?projectid=${encodeURIComponent(projectId)}`, {
        method: "GET",
        cache: "no-store", // чтобы не словить кэш
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLinks(data);

      
      interface RankedLink {
        _id: string;
        shortId: string;
        url: string;
        clicks: number;
        rank: number;
      }

      setSortedLinks((data.slice()
        .sort((a: { clicks: number }, b: { clicks: number }) => b.clicks - a.clicks)
        .map((link: { _id: string; shortId: string; url: string; clicks: number }, index: number): RankedLink => ({
          ...link,
          rank: index + 1
        }))));
      console.log("Links for project:", data);
    } catch (error) {
      console.error("Error fetching links for project:", error);
    }
  };
  fetchLinks();
}, [projectId]);


  // имя цвета в состоянии
  const [colorName, setColorName] = useState<ColorName>(color);
  useEffect(() => setColorName(color), [color]);

  // дериваты из карты
  const palette = colorMap[colorName] ?? colorMap.blue;
  const mainHex = palette.mainColor;

  // esc закрывает модалку
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const colorNames = Object.keys(colorMap) as ColorName[];

  const SegTabs = ({
    value,
    onChange,
  }: { value: "links" | "analytics"; onChange: (v: "links" | "analytics") => void }) => (
    <div className="inline-flex rounded-2xl bg-gray-100 p-1 text-sm font-medium">
      {(["links", "analytics"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={`px-4 py-2 rounded-2xl transition flex items-center gap-2 ${
            value === k ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {k === "links" ? (
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 0 0 0 6h3v2h-3a5 5 0 0 1-5-5Zm6-1h4v2h-4v-2Zm5.2-4h3a5 5 0 1 1 0 10h-3v-2h3a3 3 0 1 0 0-6h-3V7Z" fill="currentColor"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 13h3v7H4v-7Zm6-6h3v13h-3V7Zm6 3h3v10h-3V10Z" fill="currentColor"/></svg>
          )}
          {k === "links" ? "Links" : "Analytics"}
        </button>
      ))}
    </div>
  );

  const StatCard = ({ title, value, sub }: { title: string; value: string | number; sub?: string }) => (
    <div className="flex-1 min-w-[210px] rounded-2xl border bg-white p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-4xl font-bold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-emerald-600">{sub}</div>}
    </div>
  );

  return (
    <div
      onClick={() => setOpen(true)}
      className="
        group relative flex flex-col
        w-full max-w-[360px] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-14px)] lg:w-[320px]
        rounded-2xl border border-gray-200/80 dark:border-white/10
        bg-white dark:bg-neutral-900
        shadow-sm hover:shadow-md transition-all duration-300 ease-out
        hover:-translate-y-0.5 overflow-hidden
      "
      role="article"
      aria-label={title}
    >
      {/* верхняя цветная полоска */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          backgroundImage: `linear-gradient(to right, ${shadeHex(mainHex, 25)}, ${shadeHex(mainHex, -5)})`,
        }}
      />

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="flex items-start gap-3">
          {/* иконка папки */}
          <div
            className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
            style={{ backgroundColor: mainHex }}
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ fill: shadeHex(mainHex, -35) }}
            >
              <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h4.086c.464 0 .908.184 1.236.512l1.172 1.176c.328.329.772.512 1.236.512H19.25A1.75 1.75 0 0 1 21 9v8.25A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {cardTitle}
            </h3>
            {cardDescription && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {cardDescription}
              </p>
            )}
          </div>

          {/* меню */}
          <button
            type="button"
            className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700
                       dark:hover:bg-white/5 dark:text-gray-400"
            aria-label="Open folder menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* метрики */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="inline-flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 12h4v8H4v-8Zm6-6h4v14h-4V6Zm6 9h4v5h-4v-5Z" />
            </svg>
            <span className="tabular-nums">{linksCount}</span>
            <span>links</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 16.32-4.9l1.86-1.86v7h-7l2.62-2.62A6 6 0 1 0 18 12h2a8 8 0 1 1-8-8v2A6 6 0 1 0 12 20a6 6 0 0 0 6-6h-2a4 4 0 1 1-4-4v2a2 2 0 1 0 2 2h2a4 4 0 1 1-4 4A8 8 0 0 1 3 12Z" />
            </svg>
            <span className="tabular-nums">{clicks.toLocaleString()}</span>
            <span>clicks</span>
          </div>
        </div>
      </div>

      {/* Модалка */}
      <Modal open={open} onClose={() => setOpen(false)} title={cardTitle}>
        <div className="max-h-[60vh] overflow-y-auto z-[999999]">
          {/* header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-2">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl grid place-items-center text-white shadow-md"
                style={{ background: mainHex }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4l2 2h8a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h5z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-tight">{cardTitle || "Project"}</h2>
                <p className="text-gray-500 -mt-0.5">
                  {description}
                </p>
              </div>
            </div>

            <SegTabs value={tab} onChange={setTab} />
          </div>

          {/* summary stats */}
          {tab === "links" ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
              <StatCard title="Total Links" value={3} />
              <StatCard title="Total Clicks" value={2847} />
              <StatCard title="Avg. Clicks/Link" value={949} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
              <StatCard title="Total Clicks" value="2,847" sub="+12% from last week" />
              <StatCard title="Avg. Daily" value={407} />
              <StatCard title="Active Links" value={3} />
            </div>
          )}

          {/* LINKS TAB */}
          {tab === "links" && (
            <div className="mt-6 space-y-6 px-2">
              {/* Project Settings */}
              <div className="rounded-2xl border p-4">
                <h3 className="text-lg font-semibold mb-4">Project Settings</h3>

                <div className="flex flex-col gap-4 md:flex-row">
                  <input
                    name="title"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    placeholder="Project Name"
                    autoComplete="off"
                    className="h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                  />
                  <div className="min-w-[220px]">
                    <div className="mb-2 text-sm text-gray-600">Project Color</div>

                    <ColorSwatchesByName
                      value={colorName}
                      onChange={setColorName}
                      names={colorNames}
                    />

                    {/* имя цвета для Server Action / формы */}
                    <input type="hidden" name="color" value={colorName} />
                  </div>
                </div>

                <textarea
                  name="description"
                  value={cardDescription ?? ""}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="Description"
                  autoComplete="off"
                  className="mt-4 min-h-[100px] max-h-[320px] w-full rounded-2xl border px-4 py-2 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2 resize-y"
                />
              </div>

              {/* Add New Link */}
              <div className="rounded-2xl border p-4">
                <h3 className="text-lg font-semibold mb-3">Add New Link</h3>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    placeholder="https://your-long-url.com"
                    className="h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                  />
                  <input
                    placeholder="custom-slug"
                    className="h-11 w-full md:max-w-[260px] rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                  />
                  <button
                    type="button"
                    className="h-11 px-5 rounded-2xl bg-black text-white hover:bg-black/90 transition"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Add From Existing Links */}
              <div className="rounded-2xl border p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">Add From Existing Links</h3>
                    <p className="text-sm text-gray-500">Выберите уже созданные шорт-ссылки и добавьте их в проект.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Search by slug or URL"
                      className="h-10 w-[260px] rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                    />
                    <select
                      className="h-10 rounded-2xl border px-3 outline-none"
                      value={sortOption}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="most-clicks">Sort: Most clicks</option>
                      <option value="least-clicks">Sort: Least clicks</option>
                      <option value="az">Sort: A–Z</option>
                      <option value="za">Sort: Z–A</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border bg-white">
                  <div className="grid grid-cols-[40px_1.2fr_2fr_140px] gap-4 text-sm text-gray-500 px-4 py-3">
                    <div />
                    <div>Short Link</div>
                    <div>Original URL</div>
                    <div className="text-right">Clicks</div>
                  </div>
                  <div className="border-t">
                    {emptyLinks.map((r) => (
                      <div
                        key={r._id}
                        className="grid grid-cols-[40px_1.2fr_2fr_140px] gap-4 items-center px-4 py-3 hover:bg-gray-50"
                      >
                        <div>
                          <input type="checkbox" className="size-5 rounded-md border-gray-300" onChange={() => {}} />
                        </div>
                        <div className="font-medium">rld.bio/{r.shortId}</div>
                        <div className="truncate text-gray-600">{r.originalUrl}</div>
                        <div className="text-right">
                          <span className="rounded-xl bg-gray-100 px-2 py-1 text-sm font-medium">{r.clicks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="rounded-lg border px-2 py-1">0 selected</span>
                    <span className="hidden sm:inline">— выберите ссылки выше</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="px-4 py-2 rounded-2xl border hover:bg-gray-50 transition w-full sm:w-auto">Cancel</button>
                    <button className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/90 transition w-full sm:w-auto">Add Selected</button>
                  </div>
                </div>
              </div>

              {/* Links Table */}
              <div className="rounded-2xl border">
                <div className="p-4 text-lg font-semibold">Links in this Project ({links.length})</div>
                <div className="border-t px-4 pb-4">
                  <div className="grid grid-cols-[1.2fr_2fr_120px] gap-4 text-sm text-gray-500 px-2 pb-2">
                    <div>Short Link</div>
                    <div>Original URL</div>
                    <div className="text-right">Clicks</div>
                  </div>

                  {links.map((r) => (
                    <div
                      key={r._id}
                      className="grid grid-cols-[1.2fr_2fr_120px] gap-4 items-center rounded-xl px-2 py-3 hover:bg-gray-50"
                    >
                      <a href={`/${r.shortId}`} className="font-medium">rld.bio/{r.shortId}</a>
                      <div className="truncate text-gray-600">{r.originalUrl}</div>
                      <div className="text-right">
                        <span className="rounded-xl bg-gray-100 px-2 py-1 text-sm font-medium">{r.clicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === "analytics" && (
            <div className="mt-6 space-y-6 px-2">
              <div className="rounded-2xl border p-4">
                <h3 className="text-lg font-semibold mb-1">Clicks Over Time</h3>
                <p className="text-sm text-gray-500 mb-4">Daily click performance for the last 7 days</p>
                <div className="h-56 w-full rounded-xl bg-gradient-to-b from-white to-gray-50 border grid place-items-center">
                  <div className="text-gray-400 text-sm">[chart placeholder]</div>
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <h3 className="text-lg font-semibold mb-3">Link Performance</h3>
                <div className="h-56 w-full rounded-xl border bg-white grid grid-cols-3 gap-6 place-items-end p-6">
                  <div className="w-full h-[220px] bg-black rounded-xl" />
                  <div className="w-full h-[260px] bg-black rounded-xl" />
                  <div className="w-full h-[200px] bg-black rounded-xl" />
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Top Performing Links</h4>
                  <div className="grid grid-cols-[80px_1.3fr_120px] gap-3 text-sm text-gray-500 px-1 pb-2">
                    <div>Rank</div>
                    <div>Short Link</div>
                    <div className="text-right">Clicks</div>
                  </div>

                  {sortedLinks.map((r) => (
                    <div
                      key={r._id}
                      className="grid grid-cols-[80px_1.3fr_120px] gap-3 items-center rounded-xl px-2 py-3 hover:bg-gray-50"
                    > 
                      <div className="font-medium">{r.rank}</div>
                      <div className="font-medium">rld.bio/{r.shortId}</div>
                      <div className="text-right">
                        <span className="rounded-xl bg-gray-100 px-2 py-1 text-sm font-medium">{r.clicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 px-2 py-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-2xl border hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/90 transition">
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}