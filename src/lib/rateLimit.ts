import "server-only";
import { headers } from "next/headers";
import dbConnect from "@/lib/db/dbConnect";
import RateLimit from "@/lib/db/models/RateLimit";
import { HttpError } from "@/lib/auth/auth";

export type RateLimitRule = { limit: number; windowSec: number };

export const RULES = {
  loginByIp: { limit: 20, windowSec: 15 * 60 },
  loginByEmail: { limit: 8, windowSec: 15 * 60 },
  register: { limit: 5, windowSec: 60 * 60 },
  createLinkAnon: { limit: 10, windowSec: 60 * 60 },
  createLinkUser: { limit: 100, windowSec: 60 * 60 },
  passwordChange: { limit: 5, windowSec: 15 * 60 },
} satisfies Record<string, RateLimitRule>;

export class RateLimitError extends HttpError {
  constructor(public retryAfterSec: number) {
    super(429, `Too many attempts. Try again in ${Math.ceil(retryAfterSec / 60)} min.`);
  }
}

/**
 * Fixed-window counter stored in Mongo, so limits hold across serverless instances.
 * Throws RateLimitError once `limit` hits within the window are exceeded.
 */
export async function rateLimit(bucket: string, key: string, rule: RateLimitRule, now = Date.now()) {
  const windowMs = rule.windowSec * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const expiresAt = new Date(windowStart + windowMs);

  await dbConnect();
  const hit = () =>
    RateLimit.findOneAndUpdate(
      { _id: `${bucket}:${key}:${windowStart}` },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, new: true }
    ).lean<{ count: number }>();
  // two concurrent upserts of a new window can race on _id; the retry hits the existing doc
  const doc = await hit().catch((err) => {
    if ((err as { code?: number }).code === 11000) return hit();
    throw err;
  });

  if (doc && doc.count > rule.limit) {
    throw new RateLimitError(Math.max(1, Math.round((expiresAt.getTime() - now) / 1000)));
  }
}

/** Best-effort client IP; Vercel and most proxies put the client first in x-forwarded-for. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
