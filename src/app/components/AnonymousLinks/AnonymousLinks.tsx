import Link from "next/link";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";
import type { LinkItem } from "@/lib/services/link.service";

/** Links a signed-out visitor created from this browser, with a nudge to keep them. */
export default function AnonymousLinks({ links }: { links: LinkItem[] }) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="anon-links-heading" className="mt-16">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="anon-links-heading" className="text-xl font-semibold">
          Your links on this device
        </h2>
        <p className="text-sm text-ink-soft">
          <Link href="/signup" className="text-link underline underline-offset-4 hover:text-link-hover">
            Create an account
          </Link>{" "}
          to keep them. They move over with their clicks.
        </p>
      </div>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {links.map((l) => (
          <RecentLinks key={l._id} id={l._id} title={l.originalUrl} url={l.shortId} clicks={l.clicks} date={l.createdAt} />
        ))}
      </ul>
    </section>
  );
}
