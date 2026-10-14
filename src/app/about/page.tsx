import Image from "next/image";
import { ButtonLink } from "@/app/components/UI/Button/Button";

export const metadata = { title: "About" };

const stack: [string, string][] = [
  ["Next.js 15 and React 19", "App Router, server components, server actions, and after() to record clicks without slowing the redirect."],
  ["MongoDB and Mongoose", "Links, visits, projects, server-side sessions and rate-limit counters."],
  ["Auth", "Signed JWTs in httpOnly cookies, backed by revocable sessions; bcrypt for passwords."],
  ["Tailwind CSS", "A small token system with light and dark themes."],
  ["Recharts", "Click charts on the overview and project pages."],
  ["Vitest and Playwright", "Service tests against an in-memory MongoDB, and end-to-end tests in a real browser."],
];

export default function AboutPage() {
  return (
    <main className="shell pt-10 sm:pt-14">
      <article className="max-w-[68ch]">
        <Image src="/logo-black.png" alt="" width={44} height={44} className="dark:invert" />
        <h1 className="mt-6 text-title font-semibold">About Relinxr</h1>

        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
          <p>
            Relinxr turns long URLs into short ones and tells you how often they get opened. Anyone can shorten a
            link without an account. With one, links can be grouped into projects and you can see clicks by day and
            by country.
          </p>
          <p>
            It records only what it needs to count a click: the time, the visitor&apos;s IP address, their browser and
            the country it maps to. Link-preview bots from chat apps are redirected but not counted, so the numbers
            reflect people.
          </p>
        </div>

        <h2 className="mt-14 text-xl font-semibold">How it&apos;s built</h2>
        <dl className="mt-4 divide-y divide-line border-y border-line">
          {stack.map(([name, what]) => (
            <div key={name} className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-medium text-ink">{name}</dt>
              <dd className="text-ink-soft">{what}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-ink-soft">
          The source is on{" "}
          <a href="https://github.com/chlorei/https---github.com-chlorei-linklab" className="text-link underline underline-offset-4">
            GitHub
          </a>{" "}
          under the MIT license.
        </p>

        <h2 className="mt-14 text-xl font-semibold">Who made it</h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">
          Relinxr is designed and built by Aleksandr Alekseev, a computer science student and web developer who likes
          small, carefully made tools.
        </p>

        <div className="mt-10">
          <ButtonLink href="/" variant="accent" size="lg">
            Shorten a link
          </ButtonLink>
        </div>
      </article>
    </main>
  );
}
