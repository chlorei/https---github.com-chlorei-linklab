"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, Copy, Trash2 } from "lucide-react";
import { SHORT_DOMAIN, shortLinkUrl } from "@/app/utils/shortDomain";
import { displayUrl } from "@/app/utils/displayUrl";

dayjs.extend(relativeTime);

type RecentLinksProps = {
  title: string;
  url: string;
  clicks: number;
  date: string | Date;
  id: string;
  projectId?: string;
  className?: string;
};

const iconButton =
  "grid size-9 place-items-center rounded-control text-ink-faint transition-colors hover:bg-sunken hover:text-ink";

/** One link as a list row: short link, destination, clicks, age, actions. Render inside a <ul>. */
const RecentLinks = ({ title, url, clicks, date, id, className = "" }: RecentLinksProps) => {
  const slug = url.replace(/^\//, "");
  const href = shortLinkUrl(slug);
  const [state, setState] = useState<"idle" | "deleting" | "copied">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm(`Delete ${SHORT_DOMAIN}/${slug}? Its click history is deleted too.`)) return;
    setState("deleting");
    setError(null);
    try {
      const res = await fetch("/api/links/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Couldn't delete the link.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete the link.");
      setState("idle");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(href);
      setState("copied");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setError("Couldn't copy. Select the link and copy it manually.");
    }
  }

  const created = new Date(date);

  return (
    <li
      className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[minmax(0,1fr)_6rem_7.5rem_auto] ${
        state === "deleting" ? "opacity-50" : ""
      } ${className}`}
    >
      <div className="min-w-0">
        <a href={href} target="_blank" rel="noopener noreferrer" className="short-link text-[0.9375rem]">
          {SHORT_DOMAIN}/{slug}
        </a>
        <p className="mt-0.5 truncate text-sm text-ink-soft" title={title}>
          {displayUrl(title)}
        </p>
        {error && (
          <p role="alert" className="mt-1 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <p className="col-start-1 text-sm text-ink-soft sm:col-start-auto sm:text-right">
        <span className="font-medium tabular-nums text-ink">{clicks.toLocaleString()}</span>{" "}
        {clicks === 1 ? "click" : "clicks"}
      </p>

      <p className="hidden text-sm text-ink-soft sm:block sm:text-right">
        <time dateTime={created.toISOString()} title={created.toLocaleString()}>
          {dayjs(created).fromNow()}
        </time>
      </p>

      <div className="col-start-2 row-span-2 row-start-1 flex items-center gap-0.5 sm:col-start-auto sm:row-span-1 sm:row-start-auto">
        <button type="button" onClick={handleCopy} aria-label={`Copy ${SHORT_DOMAIN}/${slug}`} className={iconButton}>
          {state === "copied" ? <Check size={17} className="text-success" /> : <Copy size={17} />}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={state === "deleting"}
          aria-label={`Delete ${SHORT_DOMAIN}/${slug}`}
          className={`${iconButton} hover:text-danger`}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </li>
  );
};

export default RecentLinks;
