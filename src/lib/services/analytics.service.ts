import "server-only";
import { Types } from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import Visit from "@/lib/db/models/Visit";
import { UNKNOWN_COUNTRY } from "@/lib/geo";

export type ActivityPoint = { day: string; clicks: number };
export type CountryStat = { countryName: string; clicks: number };

const DEFAULT_TZ = "Europe/Berlin";
const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(d: Date, tz: string) {
  // en-CA formats as YYYY-MM-DD, matching Mongo's %Y-%m-%d
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Daily click counts for the last `days` days (including today) in `tz`, zero-filled. */
async function dailyActivity(match: Record<string, unknown>, tz: string, days: number): Promise<ActivityPoint[]> {
  await dbConnect();
  const now = new Date();
  // one extra day of margin covers any timezone offset; buckets outside the window are ignored
  const since = new Date(now.getTime() - (days + 1) * DAY_MS);

  const rows: { _id: string; clicks: number }[] = await Visit.aggregate([
    { $match: { ...match, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: tz } },
        clicks: { $sum: 1 },
      },
    },
  ]);
  const counts = new Map(rows.map((r) => [r._id, r.clicks]));

  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz });
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now.getTime() - (days - 1 - i) * DAY_MS);
    return { day: weekday.format(d), clicks: counts.get(dateKey(d, tz)) ?? 0 };
  });
}

/** Daily clicks across all of a user's links for the last `days` days, in time zone `tz`. */
export function getUserActivity(userId: string, tz = DEFAULT_TZ, days = 7) {
  return dailyActivity({ creatorUserId: new Types.ObjectId(userId) }, tz, days);
}

/** Activity per project, keyed by project id. */
export async function getProjectsActivity(projectIds: string[], tz = DEFAULT_TZ, days = 7) {
  const entries = await Promise.all(
    projectIds.map(async (id) => [id, await dailyActivity({ projectId: new Types.ObjectId(id) }, tz, days)] as const)
  );
  return Object.fromEntries(entries) as Record<string, ActivityPoint[]>;
}

/** Total recorded clicks across all of a user's links. */
export async function countUserVisits(userId: string) {
  await dbConnect();
  return Visit.countDocuments({ creatorUserId: userId });
}

/** Clicks per country, derived from the visits themselves so deleted links drop out. */
export async function getUserCountries(userId: string): Promise<CountryStat[]> {
  await dbConnect();
  const rows: { _id: string; clicks: number }[] = await Visit.aggregate([
    { $match: { creatorUserId: new Types.ObjectId(userId) } },
    { $group: { _id: { $ifNull: ["$countryName", UNKNOWN_COUNTRY] }, clicks: { $sum: 1 } } },
    { $sort: { clicks: -1, _id: 1 } },
  ]);
  return rows.map((r) => ({ countryName: r._id, clicks: r.clicks }));
}

/** The leading country, ignoring visits whose country couldn't be determined. */
export function pickTopCountry(countries: CountryStat[]): CountryStat | null {
  return countries.find((c) => c.countryName !== UNKNOWN_COUNTRY) ?? null;
}

/**
 * Records one click: a Visit document (with its country, for per-country stats) and an
 * increment of the link's denormalized `clicks` counter. Called in the background from the
 * redirect route via `after()`.
 */
export async function recordVisit(
  link: { _id: Types.ObjectId; userId?: Types.ObjectId | null; projectId?: Types.ObjectId | null },
  visit: { ip?: string; userAgent?: string; countryName: string }
) {
  await dbConnect();
  await Promise.all([
    Visit.create({
      linkId: link._id,
      ip: visit.ip,
      userAgent: visit.userAgent,
      countryName: visit.countryName,
      creatorUserId: link.userId ?? null,
      projectId: link.projectId ?? null,
    }),
    Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } }),
  ]);
}
