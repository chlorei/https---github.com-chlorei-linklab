import "server-only";
import { cache } from "react";
import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/dbConnect";
import SessionModel from "@/lib/db/models/Session";

export type SessionUser = { id: string; email: string; name: string };
export type Session = SessionUser | null;

export const AUTH_COOKIE = "token";
const TOKEN_TTL_SECONDS = 70 * 60 * 60; // 70h

type TokenPayload = SessionUser & { jti: string };

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return secret;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function signToken(user: SessionUser, sessionId: string): string {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, getSecret(), {
    algorithm: "HS256",
    expiresIn: TOKEN_TTL_SECONDS,
    jwtid: sessionId,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const { id, email, name, jti } = jwt.verify(token, getSecret(), { algorithms: ["HS256"] }) as TokenPayload;
    // tokens issued before server-side sessions existed have no jti and are rejected
    if (!id || !jti) return null;
    return { id, email, name, jti };
  } catch {
    return null;
  }
}

async function writeCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });
}

/** Starts a new revocable session for `user` and sets the auth cookie. */
export async function createSession(user: SessionUser) {
  const h = await headers();
  const sessionId = randomUUID();
  await dbConnect();
  await SessionModel.create({
    _id: sessionId,
    userId: user.id,
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    expiresAt: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000),
  });
  await writeCookie(signToken(user, sessionId));
}

/** Re-signs the cookie for the current session, e.g. after the user's name or email changed. */
export async function refreshSessionCookie(user: SessionUser, sessionId: string) {
  await writeCookie(signToken(user, sessionId));
}

/** Verified token + live server-side session, memoized per request. */
export const getCurrentSession = cache(async (): Promise<{ user: SessionUser; sessionId: string } | null> => {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return null;

  await dbConnect();
  const alive = await SessionModel.exists({ _id: payload.jti, userId: payload.id, expiresAt: { $gt: new Date() } });
  if (!alive) return null;

  const { jti, ...user } = payload;
  return { user, sessionId: jti };
});

export async function getSession(): Promise<Session> {
  return (await getCurrentSession())?.user ?? null;
}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new HttpError(401, "Unauthorized");
  return s;
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/** Revokes the current session (if any) and clears the cookie. */
export async function destroySession() {
  const current = await getCurrentSession();
  if (current) await SessionModel.deleteOne({ _id: current.sessionId });
  await clearAuthCookie();
}

/** Revokes every session of the user, optionally keeping one (the caller's). */
export async function revokeUserSessions(userId: string, keepSessionId?: string) {
  await dbConnect();
  const filter = keepSessionId ? { userId, _id: { $ne: keepSessionId } } : { userId };
  const res = await SessionModel.deleteMany(filter);
  return res.deletedCount;
}
