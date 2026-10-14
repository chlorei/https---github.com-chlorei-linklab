"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Modal from "../ProjectModal/ProjectModal";
import ActivityChart from "../ActivityChart/ActivityChart";
import Sparkline from "../Sparkline/Sparkline";
import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";
import { Button } from "@/app/components/UI/Button/Button";
import { Field, FormMessage, Input, Textarea } from "@/app/components/UI/Field/Field";
import colorMap from "@/app/utils/colorMap";
import { SHORT_DOMAIN } from "@/app/utils/shortDomain";
import { displayUrl } from "@/app/utils/displayUrl";
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

function ColorDot({ color, size = "size-3" }: { color: string; size?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full border border-black/10 ${size}`}
      style={{ backgroundColor: colorMap[toColorName(color)].mainColor }}
    />
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6 first:border-0 first:pt-0">
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ProjectCard({ project, links, unassignedLinks, activity }: ProjectCardProps) {
  const router = useRouter();
  const projectId = project._id;

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
  };

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const weekClicks = activity.reduce((sum, p) => sum + p.clicks, 0);
  const dirty =
    title !== project.title || description !== project.description || colorName !== toColorName(project.color);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    setSaved(false);
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
    if (ok) setSaved(true);
  };

  const handleDeleteProject = () => {
    if (!window.confirm(`Delete "${project.title}"? Its links are kept and become unfiled.`)) return;
    run(() => request("/api/projects/delete", { method: "POST", body: JSON.stringify({ projectId }) })).then(
      (ok) => ok && setOpen(false)
    );
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open project ${project.title}`}
        className="group flex w-full flex-col rounded-panel border border-line bg-surface p-5 text-left transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-link"
      >
        <div className="flex items-center gap-2.5">
          <ColorDot color={project.color} />
          <h3 className="min-w-0 truncate text-lg font-semibold group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
            {project.title}
          </h3>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-[2.75em] text-sm text-ink-soft">
          {project.description || "No description"}
        </p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <dl className="flex gap-5 text-sm">
            <div>
              <dt className="text-ink-faint">Links</dt>
              <dd className="font-medium tabular-nums text-ink">{links.length}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Clicks</dt>
              <dd className="font-medium tabular-nums text-ink">{totalClicks.toLocaleString()}</dd>
            </div>
          </dl>
          <div className="text-link" title={`${weekClicks} clicks in the last 7 days`}>
            <Sparkline values={activity.map((p) => p.clicks)} />
          </div>
        </div>
      </button>

      <Modal open={open} onClose={closeModal} title={project.title} leading={<ColorDot color={project.color} size="size-3.5" />}>
        <div className="flex flex-col gap-8">
          {error && <FormMessage tone="error">{error}</FormMessage>}

          <Section
            title="Clicks, last 7 days"
            description={`${weekClicks.toLocaleString()} this week, ${totalClicks.toLocaleString()} all time across ${links.length} ${
              links.length === 1 ? "link" : "links"
            }.`}
          >
            <ActivityChart data={activity} height={180} />
          </Section>

          <Section title={`Links in this project (${links.length})`}>
            {links.length === 0 ? (
              <p className="text-sm text-ink-soft">No links yet. Add a new one or file existing links below.</p>
            ) : (
              <ul className="-my-3 divide-y divide-line">
                {links.map((r) => (
                  <li key={r._id} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <a href={`/${r.shortId}`} target="_blank" rel="noopener noreferrer" className="short-link text-sm">
                        {SHORT_DOMAIN}/{r.shortId}
                      </a>
                      <p className="truncate text-sm text-ink-soft">{displayUrl(r.originalUrl)}</p>
                    </div>
                    <span className="text-sm tabular-nums text-ink-soft">
                      {r.clicks} {r.clicks === 1 ? "click" : "clicks"}
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDetach(r._id)}
                      aria-label={`Remove ${SHORT_DOMAIN}/${r.shortId} from project`}
                      title="Remove from project"
                      className="grid size-8 place-items-center rounded-control text-ink-faint hover:bg-sunken hover:text-danger"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Add a link">
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateLink();
              }}
            >
              <label htmlFor={`new-link-${projectId}`} className="sr-only">
                Long URL
              </label>
              <Input
                id={`new-link-${projectId}`}
                value={newUrl}
                type="text"
                inputMode="url"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="example.com/your-long-link"
              />
              <Button type="submit" variant="accent" disabled={busy || !newUrl.trim()} className="h-11">
                Shorten and add
              </Button>
            </form>

            {unassignedLinks.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium">Or file existing links</p>
                <ul className="mt-2 max-h-56 divide-y divide-line overflow-y-auto rounded-control border border-line">
                  {unassignedLinks.map((r) => (
                    <li key={r._id}>
                      <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-sunken">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(r._id)}
                          onChange={() => toggle(r._id)}
                          className="size-4 accent-[var(--link)]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-sm text-ink">
                            {SHORT_DOMAIN}/{r.shortId}
                          </span>
                          <span className="block truncate text-sm text-ink-soft">{displayUrl(r.originalUrl)}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-3">
                  <Button variant="primary" size="sm" disabled={busy || selectedIds.length === 0} onClick={handleAddSelected}>
                    {selectedIds.length > 0 ? `Add ${selectedIds.length} to project` : "Add to project"}
                  </Button>
                  {selectedIds.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                      Clear selection
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Section>

          <Section title="Settings">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <Field label="Name" htmlFor={`title-${projectId}`}>
                <Input
                  id={`title-${projectId}`}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Project Name"
                  autoComplete="off"
                  maxLength={100}
                  required
                />
              </Field>
              <Field label="Description" htmlFor={`desc-${projectId}`}>
                <Textarea
                  id={`desc-${projectId}`}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="What these links are for"
                  maxLength={1000}
                />
              </Field>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Color</span>
                <ColorPicker value={colorName} onChange={(c) => setColorName(c as ColorName)} colors={COLOR_NAMES} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button variant="danger" size="sm" onClick={handleDeleteProject} disabled={busy}>
                  Delete project
                </Button>
                <div className="flex items-center gap-3">
                  {saved && !dirty && <FormMessage tone="success">Saved</FormMessage>}
                  <Button type="submit" variant="primary" disabled={busy || !dirty || !title.trim()}>
                    {busy ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Section>
        </div>
      </Modal>
    </>
  );
}
