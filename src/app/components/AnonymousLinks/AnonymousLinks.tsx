import Link from "next/link";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";
import type { LinkItem } from "@/lib/services/link.service";

/** Links a signed-out visitor created from this browser, with a nudge to keep them. */
export default function AnonymousLinks({ links }: { links: LinkItem[] }) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="anon-links-heading" className="mx-auto mt-10 w-full max-w-2xl rounded-2xl border-2 p-6 text-primary-text">
      <h2 id="anon-links-heading" className="font-bold">
        Your links on this device
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Only this browser can see and manage them.{" "}
        <Link href="/signup" className="font-medium underline underline-offset-4">
          Create a free account
        </Link>{" "}
        or{" "}
        <Link href="/signin?next=/links" className="font-medium underline underline-offset-4">
          sign in
        </Link>{" "}
        to keep them for good — they&apos;ll move to your account with their click stats.
      </p>

      <div className="mt-3">
        {links.map((l) => (
          <RecentLinks key={l._id} id={l._id} title={l.originalUrl} url={l.shortId} clicks={l.clicks} date={l.createdAt} />
        ))}
      </div>
    </section>
  );
}
