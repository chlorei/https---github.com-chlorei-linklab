import { afterEach, describe, expect, it, vi } from "vitest";
import { Types } from "mongoose";
import Visit from "@/lib/db/models/Visit";
import Link from "@/lib/db/models/Link";
import { getUserActivity, getUserCountries, pickTopCountry, recordVisit } from "@/lib/services/analytics.service";
import { backfillVisitCountries } from "@/lib/migrations/backfillVisitCountries";
import { rateLimit, RateLimitError } from "@/lib/rateLimit";
import dbConnect from "@/lib/db/dbConnect";

afterEach(() => vi.useRealTimers());

describe("getUserActivity", () => {
  it("returns a zero-filled series bucketed by the viewer's local day", async () => {
    await dbConnect();
    vi.useFakeTimers({ now: new Date("2026-10-14T12:00:00Z"), toFake: ["Date"] });
    const userId = new Types.ObjectId();
    const linkId = new Types.ObjectId();
    const at = (iso: string) => ({ linkId, creatorUserId: userId, createdAt: new Date(iso) });

    await Visit.insertMany([
      at("2026-10-14T08:00:00Z"),
      at("2026-10-14T09:00:00Z"),
      // 23:30 UTC on the 12th is already the 13th in Berlin (UTC+2)
      at("2026-10-12T23:30:00Z"),
      // outside the 7-day window
      at("2026-10-01T10:00:00Z"),
    ]);

    const series = await getUserActivity(userId.toString(), "Europe/Berlin", 7);
    expect(series).toHaveLength(7);
    expect(series.map((p) => p.clicks)).toEqual([0, 0, 0, 0, 0, 1, 2]);
    expect(series.at(-1)?.day).toBe("Wed");

    const utcSeries = await getUserActivity(userId.toString(), "UTC", 7);
    expect(utcSeries.map((p) => p.clicks)).toEqual([0, 0, 0, 0, 1, 0, 2]);
  });
});

describe("recordVisit", () => {
  it("logs the visit with its country and bumps the link counter", async () => {
    await dbConnect();
    const userId = new Types.ObjectId();
    const link = await Link.create({ shortId: "abc1234", originalUrl: "https://example.com", userId });

    await recordVisit(link, { ip: "1.2.3.4", userAgent: "ua", countryName: "Germany" });
    await recordVisit(link, { countryName: "Germany" });

    expect((await Link.findById(link._id).lean<{ clicks: number }>())?.clicks).toBe(2);
    expect(await Visit.countDocuments({ linkId: link._id, creatorUserId: userId })).toBe(2);
    expect(await getUserCountries(userId.toString())).toEqual([{ countryName: "Germany", clicks: 2 }]);
  });
});

describe("country stats", () => {
  it("are derived from visits, so deleting a link removes its clicks", async () => {
    await dbConnect();
    const userId = new Types.ObjectId();
    const keep = await Link.create({ shortId: "keep001", originalUrl: "https://a.example.com", userId });
    const gone = await Link.create({ shortId: "gone001", originalUrl: "https://b.example.com", userId });

    await recordVisit(keep, { countryName: "Germany" });
    for (let i = 0; i < 3; i++) await recordVisit(gone, { countryName: "France" });
    await Visit.create({ linkId: keep._id, creatorUserId: userId }); // legacy visit, no country

    expect(await getUserCountries(userId.toString())).toEqual([
      { countryName: "France", clicks: 3 },
      { countryName: "Germany", clicks: 1 },
      { countryName: "Unknown", clicks: 1 },
    ]);

    await Visit.deleteMany({ linkId: gone._id });
    const after = await getUserCountries(userId.toString());
    expect(after).toEqual([
      { countryName: "Germany", clicks: 1 },
      { countryName: "Unknown", clicks: 1 },
    ]);
    expect(pickTopCountry(after)?.countryName).toBe("Germany");
    expect(pickTopCountry([{ countryName: "Unknown", clicks: 9 }])).toBeNull();
  });
});

describe("backfillVisitCountries", () => {
  it("geolocates each distinct IP once and only touches visits without a country", async () => {
    await dbConnect();
    const linkId = new Types.ObjectId();
    await Visit.insertMany([
      { linkId, ip: "1.1.1.1" },
      { linkId, ip: "1.1.1.1" },
      { linkId, ip: "2.2.2.2, 10.0.0.1" },
      { linkId, ip: null },
      { linkId, ip: "3.3.3.3", countryName: "Spain" },
    ]);
    const lookup = vi.fn(async (ip: string) => (ip.startsWith("1.") ? "Germany" : "France"));

    const dry = await backfillVisitCountries(lookup, { dryRun: true });
    expect(dry).toMatchObject({ ips: 2, updated: 3, noIp: 1 });
    expect(await Visit.countDocuments({ countryName: null })).toBe(4);

    const stats = await backfillVisitCountries(lookup);
    expect(stats).toMatchObject({ updated: 3, noIp: 1, byCountry: { Germany: 2, France: 1 } });
    const countries = (await Visit.find().sort({ _id: 1 }).lean<{ countryName: string }[]>()).map((v) => v.countryName);
    expect(countries).toEqual(["Germany", "Germany", "France", "Unknown", "Spain"]);

    // re-running is a no-op
    expect(await backfillVisitCountries(lookup)).toMatchObject({ ips: 0, updated: 0, noIp: 0 });
  });
});

describe("rateLimit", () => {
  it("allows `limit` hits per window, then resets in the next window", async () => {
    const rule = { limit: 3, windowSec: 60 };
    const t0 = Date.UTC(2026, 0, 1, 0, 0, 10);
    for (let i = 0; i < 3; i++) await rateLimit("t", "k", rule, t0);

    const err = await rateLimit("t", "k", rule, t0).catch((e) => e);
    expect(err).toBeInstanceOf(RateLimitError);
    expect(err.retryAfterSec).toBe(50);

    await expect(rateLimit("t", "other-key", rule, t0)).resolves.toBeUndefined();
    await expect(rateLimit("t", "k", rule, t0 + 60_000)).resolves.toBeUndefined();
  });
});
