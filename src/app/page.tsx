import { getSession } from "@/lib/auth/auth";
import { getAnonKey } from "@/lib/auth/anonymous";
import Link from "next/link";
import { listLinks } from "@/lib/services/link.service";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";
import InteractivePart from "@/app/components/InteractivePart/InteractivePart";
import AnonymousLinks from "@/app/components/AnonymousLinks/AnonymousLinks";
import { ButtonLink } from "@/app/components/UI/Button/Button";

export const dynamic = "force-dynamic";

const ANON_LINKS_SHOWN = 20;
const RECENT_SHOWN = 5;

const perks = [
  {
    title: "Projects",
    body: "Group links by campaign, client or release, and see their clicks together.",
  },
  {
    title: "Click stats",
    body: "Daily clicks and the countries they come from, for every link you make.",
  },
  {
    title: "No account needed",
    body: "Shorten right away. Links made here move into your account when you sign up.",
  },
];

export default async function Home() {
  const session = await getSession();
  const anonKey = session ? null : await getAnonKey();
  const anonLinks = anonKey ? await listLinks({ anonKey }, ANON_LINKS_SHOWN) : [];
  const recent = session ? await listLinks({ userId: session.id }, RECENT_SHOWN) : [];

  return (
    <main className="shell pt-16 sm:pt-24">
      <div className="max-w-3xl">
        <h1 className="text-[clamp(2.5rem,7vw,var(--text-display))] leading-[1.02] font-semibold tracking-[-0.035em]">
          Shorten a link.
          <br />
          <span className="text-ink-soft">See who clicks it.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          Paste any URL to get a short link you can share anywhere.
          {session ? " Pick a project to file it under." : " Sign in to see clicks by day and country."}
        </p>
        <div className="mt-10">
          <InteractivePart />
        </div>
      </div>

      <AnonymousLinks links={anonLinks} />

      {recent.length > 0 && (
        <section aria-labelledby="recent-heading" className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 id="recent-heading" className="text-xl font-semibold">
              Recent links
            </h2>
            <Link href="/links" className="text-sm text-link underline-offset-4 hover:underline">
              All links
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {recent.map((l) => (
              <RecentLinks key={l._id} id={l._id} title={l.originalUrl} url={l.shortId} clicks={l.clicks} date={l.createdAt} />
            ))}
          </ul>
        </section>
      )}

      {!session && (
        <section aria-labelledby="perks-heading" className="mt-24 border-t border-line pt-10">
          <h2 id="perks-heading" className="sr-only">
            What you get with an account
          </h2>
          <dl className="grid gap-8 sm:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title}>
                <dt className="font-display text-lg font-semibold">{p.title}</dt>
                <dd className="mt-1.5 text-ink-soft">{p.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/signup" variant="primary" size="lg">
              Create free account
            </ButtonLink>
            <ButtonLink href="/signin" variant="secondary" size="lg">
              Sign in
            </ButtonLink>
          </div>
        </section>
      )}
    </main>
  );
}
