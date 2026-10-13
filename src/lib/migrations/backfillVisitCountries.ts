import dbConnect from "@/lib/db/dbConnect";
import Visit from "@/lib/db/models/Visit";
import { UNKNOWN_COUNTRY } from "@/lib/geo";

type Lookup = (ip: string) => Promise<string>;

/**
 * Fills `Visit.countryName` for visits recorded before it existed, by geolocating
 * their stored IP. Each distinct IP is looked up once. Safe to re-run: only visits
 * with no country are touched.
 */
export async function backfillVisitCountries(lookup: Lookup, opts: { dryRun?: boolean; concurrency?: number } = {}) {
  const { dryRun = false, concurrency = 5 } = opts;
  await dbConnect();

  const missing = { countryName: null };
  const ips = (await Visit.distinct("ip", missing)).filter((ip): ip is string => typeof ip === "string" && ip.trim() !== "");
  const stats = { ips: ips.length, updated: 0, noIp: 0, byCountry: {} as Record<string, number> };

  let next = 0;
  async function worker() {
    while (next < ips.length) {
      const ip = ips[next++];
      const country = await lookup(ip);
      const filter = { ...missing, ip };
      const n = dryRun
        ? await Visit.countDocuments(filter)
        : (await Visit.updateMany(filter, { $set: { countryName: country } })).modifiedCount;
      stats.updated += n;
      stats.byCountry[country] = (stats.byCountry[country] ?? 0) + n;
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, ips.length) }, worker));

  const noIpFilter = { ...missing, $or: [{ ip: null }, { ip: "" }, { ip: { $exists: false } }] };
  stats.noIp = dryRun
    ? await Visit.countDocuments(noIpFilter)
    : (await Visit.updateMany(noIpFilter, { $set: { countryName: UNKNOWN_COUNTRY } })).modifiedCount;

  return stats;
}
