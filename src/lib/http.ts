import "server-only";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { ZodError } from "zod";
import { HttpError } from "@/lib/auth/auth";
import { RateLimitError } from "@/lib/rateLimit";

export function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Maps thrown errors to a JSON response without leaking internals. */
export function handleRouteError(err: unknown, context: string) {
  if (err instanceof RateLimitError) {
    const res = jsonError(429, err.message);
    res.headers.set("Retry-After", String(err.retryAfterSec));
    return res;
  }
  if (err instanceof HttpError) return jsonError(err.status, err.message);
  if (err instanceof ZodError) return jsonError(422, err.issues[0]?.message ?? "Invalid input");
  if ((err as { code?: number })?.code === 11000) return jsonError(409, "Already exists");
  console.error(`${context}:`, err);
  // show the real cause while developing; never leak internals in production
  const detail = process.env.NODE_ENV === "development" && err instanceof Error ? `: ${err.message}` : "";
  return jsonError(500, `Internal error${detail}`);
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export function toObjectId(id: unknown, name = "id"): Types.ObjectId {
  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new HttpError(400, `Invalid ${name}`);
  }
  return new Types.ObjectId(id);
}
