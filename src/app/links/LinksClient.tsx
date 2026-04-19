"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import TextType from "@/app/components/UI/TextType/TextType";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";

type LinkItem = {
  _id: string;
  originalUrl: string;
  shortId: string;
  projectId?: string;
  clicks: number;
  createdAt: string;
};

export default function LinksClient({ links }: { links: LinkItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return links;
    return links.filter(
      (l) =>
        l.originalUrl.toLowerCase().includes(s) ||
        l.shortId.toLowerCase().includes(s)
    );
  }, [q, links]);

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <TextType
              textColors={["text-foreground"]}
              text={["All your Links"]}
              typingSpeed={25}
              pauseDuration={1500}
              showCursor
              cursorCharacter=""
              className="text-3xl font-bold text-foreground sm:text-4xl"
            />
            <p className="mt-2 text-muted-foreground">
              Manage and track your shortened links
            </p>
          </div>

          <Link
            href="/"
            prefetch={false}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Link
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            name="search"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search links..."
            className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Links List */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">
              All Links
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "link" : "links"} found
            </p>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {q
                    ? "No links match your search"
                    : "No links found. Start by creating a new shortened link!"}
                </p>
              </div>
            ) : (
              filtered.map((l) => (
                <RecentLinks
                  key={l._id}
                  title={l.originalUrl}
                  url={l.shortId}
                  clicks={l.clicks}
                  date={l.createdAt}
                  id={l._id}
                  projectId={l.projectId}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
