import { ZodError } from "zod";
import { HttpError } from "@/lib/auth/auth";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

/**
 * Server actions return errors instead of throwing: Next.js replaces thrown
 * error messages with a generic one in production.
 */
export function actionError(err: unknown, fallback: string): { ok: false; error: string } {
  if (err instanceof HttpError) return { ok: false, error: err.message };
  if (err instanceof ZodError) return { ok: false, error: err.issues[0]?.message ?? fallback };
  console.error(fallback, err);
  const detail = process.env.NODE_ENV === "development" && err instanceof Error ? ` (${err.message})` : "";
  return { ok: false, error: `${fallback}${detail}` };
}
