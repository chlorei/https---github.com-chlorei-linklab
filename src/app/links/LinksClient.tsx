"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";
import PageHeader from "@/app/components/UI/PageHeader/PageHeader";
import EmptyState from "@/app/components/UI/EmptyState/EmptyState";
import { ButtonLink } from "@/app/components/UI/Button/Button";
import { inputClass } from "@/app/components/UI/Field/Field";
import type { LinkItem } from "@/lib/services/link.service";

export default function LinksClient({ links }: { links: LinkItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return links;
    return links.filter((l) => l.originalUrl.toLowerCase().includes(s) || l.shortId.toLowerCase().includes(s));
  }, [q, links]);

  return (
    <main className="shell pt-10 sm:pt-14">
      <PageHeader
        title="Links"
        description={
          links.length === 0
            ? "Every link you shorten while signed in lands here."
            : `${links.length} ${links.length === 1 ? "link" : "links"}, newest first.`
        }
        actions={
          <ButtonLink href="/" variant="accent">
            Shorten a link
          </ButtonLink>
        }
      />

      {links.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No links yet" action={<ButtonLink href="/" variant="accent">Shorten your first link</ButtonLink>}>
            Paste a long URL on the home page to get a short one.
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="relative mt-6 max-w-md">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <label htmlFor="link-search" className="sr-only">
              Search links
            </label>
            <input
              id="link-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by destination or short link"
              className={`${inputClass} pl-10`}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="mt-8 text-ink-soft">
              No links match <span className="font-medium text-ink">“{q.trim()}”</span>.
            </p>
          ) : (
            <>
              <div className="mt-6 hidden grid-cols-[minmax(0,1fr)_6rem_7.5rem_4.75rem] gap-x-4 border-b border-line pb-2 text-sm text-ink-faint sm:grid">
                <span>Link</span>
                <span className="text-right">Clicks</span>
                <span className="text-right">Created</span>
                <span className="sr-only">Actions</span>
              </div>
              <ul className="divide-y divide-line border-b border-line">
                {filtered.map((l) => (
                  <RecentLinks
                    key={l._id}
                    title={l.originalUrl}
                    url={l.shortId}
                    clicks={l.clicks}
                    date={l.createdAt}
                    id={l._id}
                    projectId={l.projectId ?? undefined}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </main>
  );
}
