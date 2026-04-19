"use client";

import React, { HTMLAttributes } from "react";
import Link from "next/link";
import { X, ExternalLink, MousePointerClick } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("en");

type RecentLinksProps = {
  title: string;
  url: string;
  clicks: number;
  date: string | Date;
  id: string;
  projectId?: string;
  className?: string;
  fullUrl?: string;
} & HTMLAttributes<HTMLDivElement>;

const RecentLinks = ({
  title,
  url,
  clicks,
  fullUrl,
  id,
  className = "",
  ...rest
}: RecentLinksProps) => {
  const slug = url.startsWith("/") ? url.slice(1) : url;
  const href = fullUrl ?? `https://rld.bio/${slug}`;
  const [isDeleting, setIsDeleting] = React.useState(false);

  const router = useRouter();

  async function handleDelete(linkId: string) {
    setIsDeleting(true);
    await fetch("/api/links/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ linkId }),
    });
    router.refresh();
    setIsDeleting(false);
  }

  if (isDeleting) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground ${className}`}
      >
        Deleting...
      </div>
    );
  }

  return (
    <div
      className={`group flex items-start justify-between gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all duration-200 hover:border-foreground/20 hover:bg-card ${className}`}
      {...rest}
    >
      {/* Left: Content */}
      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-sm font-semibold text-card-foreground"
          title={title}
        >
          {title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
            title={href}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="truncate">rld.bio/{slug}</span>
          </Link>

          <span className="flex items-center gap-1">
            <MousePointerClick className="h-3.5 w-3.5" />
            <span className="tabular-nums">{clicks}</span> clicks
          </span>
        </div>
      </div>

      {/* Right: Delete button */}
      <button
        onClick={() => handleDelete(id)}
        type="button"
        aria-label="Delete link"
        className="shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RecentLinks;
