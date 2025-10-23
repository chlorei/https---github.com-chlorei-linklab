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
  className?: string;
  fullUrl?: string;
} & HTMLAttributes<HTMLDivElement>;

const RecentLinks = ({
  title,
  url,
  clicks,
  date,
  fullUrl,
  id,
  className = "",
  ...rest
}: RecentLinksProps) => {
  const slug = url.startsWith("/") ? url.slice(1) : url;
  const href = fullUrl ?? `https://rld.bio/${slug}`;


  const router = useRouter();
  async function handleDelete(linkId: string) {
      await fetch("/api/links/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkId }),
      });
      router.refresh();
    }
  return (
    <div
      className={[
        "mt-3",
        "group relative w-full rounded-3xl border bg-background/50",
        "p-4 md:p-5",
        "transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm",
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4",
        "text-primary-text",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="min-w-0 flex-1">
        <h3
          className="font-semibold text-base md:text-lg leading-tight truncate"
          title={title}
        >
          {title}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate max-w-full hover:underline"
            title={href}
          >
            rld.bio/<span className="tabular-nums">{slug}</span>
          </Link>

          <span className="hidden sm:inline">·</span>
          <p className="hidden sm:inline">
            <span className="tabular-nums">{clicks}</span> clicks
          </p>

          <span className="hidden sm:inline">·</span>
          <p className="hidden sm:inline">{dayjs(date).fromNow()}</p>

          <div className="sm:hidden contents">
            <p className="w-full">
              <span className="tabular-nums">{clicks}</span> clicks • {dayjs(date).fromNow()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center sm:ml-auto gap-2">
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть ссылку в новой вкладке"
          className="hidden md:inline-flex rounded-xl p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <Image
            src="/icons/external-link.svg"
            alt=""
            width={22}
            height={22}
            className="opacity-70 group-hover:opacity-100"
          />
        </Link>

        <button
          onClick={() => handleDelete(id)}
          type="button"
          aria-label="Удалить ссылку"
          className="inline-flex rounded-xl p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <Image src="/icons/x.svg" alt="" width={22} height={22} className="opacity-70 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

export default RecentLinks;