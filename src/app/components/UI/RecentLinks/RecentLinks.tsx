"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, Copy } from "lucide-react";
import { SHORT_DOMAIN, shortLinkUrl } from "@/app/utils/shortDomain";

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

const cardClass =
  "mt-3 group relative w-full rounded-3xl border bg-background/50 p-4 md:p-5 " +
  "transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm text-primary-text";

const RecentLinks = ({ title, url, clicks, date, id, className = "" }: RecentLinksProps) => {
  const slug = url.replace(/^\//, "");
  const href = shortLinkUrl(slug);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Couldn't copy to clipboard");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this link and its statistics?")) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/links/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Failed to delete link");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete link");
      setIsDeleting(false);
    }
  }

  if (isDeleting) return <div className={`${cardClass} ${className}`}>Deleting...</div>;

  return (
    <div className={`${cardClass} flex items-start justify-between gap-3 ${className}`}>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-base md:text-lg leading-tight truncate" title={title}>
          {title}
        </h3>

        <div className="mt-1 space-y-1 text-sm text-gray-500">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate max-w-full hover:underline"
            title={href}
          >
            {SHORT_DOMAIN}/<span className="tabular-nums">{slug}</span>
          </a>
          <p>
            <span className="tabular-nums">{clicks}</span> {clicks === 1 ? "click" : "clicks"}
            {date && (
              <time dateTime={new Date(date).toISOString()} title={new Date(date).toLocaleString()}>
                {" · created "}
                {dayjs(date).fromNow()}
              </time>
            )}
          </p>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      <button
        onClick={handleCopy}
        type="button"
        aria-label={copied ? "Copied" : "Copy short link"}
        title={copied ? "Copied!" : "Copy short link"}
        className="shrink-0 inline-flex rounded-xl p-2 opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>
      <button
        onClick={handleDelete}
        type="button"
        aria-label="Delete link"
        className="shrink-0 inline-flex rounded-xl p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <Image src="/icons/x.svg" alt="" width={22} height={22} className="opacity-70 group-hover:opacity-100 dark:invert" />
      </button>
    </div>
  );
};

export default RecentLinks;
