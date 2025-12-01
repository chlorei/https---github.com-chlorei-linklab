// components/RecentLinks.tsx
"use client";

import React, { HTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
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
 return isDeleting ? (
  <div
    className={[
      "mt-3",
      "group relative w-full rounded-3xl border bg-background/50",
      "p-4 md:p-5",
      "transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm",
      "text-primary-text",
      className,
    ].join(" ")}
  >
    Deleting...
  </div>
) : (
  <div
    className={[
      "mt-3",
      "group relative w-full rounded-3xl border bg-background/50",
      "p-4 md:p-5",
      "transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm",
      // КЛЮЧЕВОЕ: один ряд, слева контент, справа крестик
      "flex items-start justify-between gap-3",
      "text-primary-text",
      className,
    ].join(" ")}
    {...rest}
  >
    {/* ЛЕВАЯ ЧАСТЬ: title + ссылка + клики */}
    <div className="min-w-0 flex-1">
      <h3
        className="font-semibold text-base md:text-lg leading-tight truncate"
        title={title}
      >
        {title}
      </h3>

      <div className="mt-1 space-y-1 text-sm text-gray-500">
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate max-w-full hover:underline"
          title={href}
        >
          rld.bio/<span className="tabular-nums">{slug}</span>
        </Link>

        <p>
          <span className="tabular-nums">{clicks}</span> clicks
        </p>
      </div>
    </div>

    {/* ПРАВАЯ ЧАСТЬ: только крестик, всегда справа */}
    <button
      onClick={() => handleDelete(id)}
      type="button"
      aria-label="Удалить ссылку"
      className="shrink-0 inline-flex rounded-xl p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
    >
      <Image
        src="/icons/x.svg"
        alt=""
        width={22}
        height={22}
        className="opacity-70 group-hover:opacity-100"
      />
    </button>
  </div>
);
};

export default RecentLinks;