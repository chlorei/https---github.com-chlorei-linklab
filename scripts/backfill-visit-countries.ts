/**
 * One-off migration: store a country on every old visit, so country stats can be
 * computed from visits (and drop out when a link is deleted).
 *
 *   npx tsx --env-file=.env.local scripts/backfill-visit-countries.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/backfill-visit-countries.ts
 *
 * Needs MONGO_URI (+ MONGODB_DB if used) and IPINFO_API_TOKEN. Afterwards the legacy
 * `locations` collection is unused and can be dropped.
 */
import mongoose from "mongoose";
import { lookupCountry } from "@/lib/geo";
import { backfillVisitCountries } from "@/lib/migrations/backfillVisitCountries";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (!process.env.IPINFO_API_TOKEN) {
    console.error("IPINFO_API_TOKEN is not set — every visit would become 'Unknown'. Aborting.");
    process.exit(1);
  }

  const stats = await backfillVisitCountries(lookupCountry, { dryRun });
  console.log(dryRun ? "Dry run — nothing written." : "Done.");
  console.log(`Distinct IPs looked up: ${stats.ips}`);
  console.log(`Visits ${dryRun ? "to update" : "updated"} from IPs: ${stats.updated}`);
  console.log(`Visits without an IP (set to Unknown): ${stats.noIp}`);
  console.table(stats.byCountry);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
