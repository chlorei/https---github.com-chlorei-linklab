import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/auth";
import type { LinkOwner } from "@/lib/services/link.service";

/**
 * Anonymous visitors get a random, httpOnly browser id so they can manage the links
 * they created. Links store only its SHA-256 (`Link.anonKey`), so a DB leak can't be
 * replayed as a cookie.
 */
export const ANON_COOKIE = "anon_id";
const ANON_TTL_SECONDS = 365 * 24 * 60 * 60;

function hashAnonId(id: string) {
  return createHash("sha256").update(id).digest("hex");
}

/** The current browser's anonymous key, or null if it never created a link. */
export async function getAnonKey(): Promise<string | null> {
  const id = (await cookies()).get(ANON_COOKIE)?.value;
  return id && id.length >= 32 ? hashAnonId(id) : null;
}

/** Returns the browser's anonymous key, issuing the cookie on first use. */
export async function ensureAnonKey(): Promise<string> {
  const existing = await getAnonKey();
  if (existing) return existing;

  const id = randomBytes(32).toString("base64url");
  (await cookies()).set(ANON_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ANON_TTL_SECONDS,
  });
  return hashAnonId(id);
}

export async function clearAnonCookie() {
  (await cookies()).set(ANON_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/**
 * Owner for link operations in this request: the signed-in user, else the anonymous
 * browser. With `create`, an anonymous visitor without a cookie gets one.
 */
export async function getLinkOwner(opts: { create?: boolean } = {}): Promise<LinkOwner | null> {
  const user = await getSession();
  if (user) return { userId: user.id };
  const anonKey = opts.create ? await ensureAnonKey() : await getAnonKey();
  return anonKey ? { anonKey } : null;
}
