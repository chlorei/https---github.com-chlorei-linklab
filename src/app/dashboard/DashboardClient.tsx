import Link from "next/link";
import ActivityChart from "@/app/components/ActivityChart/ActivityChart";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";
import PageHeader from "@/app/components/UI/PageHeader/PageHeader";
import EmptyState from "@/app/components/UI/EmptyState/EmptyState";
import { ButtonLink } from "@/app/components/UI/Button/Button";
import type { LinkItem } from "@/lib/services/link.service";
import type { ActivityPoint, CountryStat } from "@/lib/services/analytics.service";

type Props = {
  firstName: string;
  links: LinkItem[];
  totalClicks: number;
  activity: ActivityPoint[];
  countries: CountryStat[];
  projectsCount: number;
};

const RECENT_SHOWN = 5;
const COUNTRIES_SHOWN = 6;

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-0 py-5 sm:px-6 sm:first:pl-0">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight">{value.toLocaleString()}</dd>
    </div>
  );
}

function CountryBars({ countries, total }: { countries: CountryStat[]; total: number }) {
  if (countries.length === 0) {
    return <p className="text-sm text-ink-soft">Countries show up here after your links get their first clicks.</p>;
  }
  const max = countries[0].clicks;
  return (
    <ol className="flex flex-col gap-3">
      {countries.slice(0, COUNTRIES_SHOWN).map((c) => (
        <li key={c.countryName}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={c.countryName === "Unknown" ? "text-ink-soft" : "text-ink"}>{c.countryName}</span>
            <span className="tabular-nums text-ink-soft">
              {c.clicks.toLocaleString()}
              <span className="ml-2 inline-block w-9 text-right text-ink-faint">
                {Math.round((c.clicks / total) * 100)}%
              </span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-sunken">
            <div className="h-full rounded-full bg-visited" style={{ width: `${(c.clicks / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function DashboardClient({ firstName, links, totalClicks, activity, countries, projectsCount }: Props) {
  const weekClicks = activity.reduce((s, p) => s + p.clicks, 0);

  return (
    <main className="shell pt-10 sm:pt-14">
      <PageHeader
        title="Overview"
        description={firstName ? `Welcome back, ${firstName}. Here's how your links are doing.` : "Here's how your links are doing."}
        actions={
          <ButtonLink href="/" variant="accent">
            Shorten a link
          </ButtonLink>
        }
      />

      <dl className="grid grid-cols-2 divide-line border-b border-line sm:grid-cols-4 sm:divide-x">
        <Stat label="Links" value={links.length} />
        <Stat label="Clicks, all time" value={totalClicks} />
        <Stat label="Clicks, last 7 days" value={weekClicks} />
        <Stat label="Projects" value={projectsCount} />
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section aria-labelledby="activity-heading">
          <h2 id="activity-heading" className="text-lg font-semibold">
            Clicks, last 7 days
          </h2>
          <div className="mt-4">
            <ActivityChart data={activity} />
          </div>
        </section>

        <section aria-labelledby="countries-heading">
          <h2 id="countries-heading" className="text-lg font-semibold">
            Where clicks come from
          </h2>
          <div className="mt-5">
            <CountryBars countries={countries} total={totalClicks || 1} />
          </div>
        </section>
      </div>

      <section aria-labelledby="recent-heading" className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 id="recent-heading" className="text-lg font-semibold">
            Recent links
          </h2>
          {links.length > RECENT_SHOWN && (
            <Link href="/links" className="text-sm text-link underline-offset-4 hover:underline">
              All {links.length} links
            </Link>
          )}
        </div>
        {links.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No links yet" action={<ButtonLink href="/" variant="accent">Shorten your first link</ButtonLink>}>
              Shorten a URL and its clicks will show up here.
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {links.slice(0, RECENT_SHOWN).map((l) => (
              <RecentLinks key={l._id} title={l.originalUrl} url={l.shortId} clicks={l.clicks} date={l.createdAt} id={l._id} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
