import "server-only";
import { cookies } from "next/headers";

export const TZ_COOKIE = "tz";
const FALLBACK_TZ = "Europe/Berlin";

export function isValidTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Viewer's IANA time zone (reported by the browser in a cookie), for day-bucketed charts. */
export async function getRequestTimeZone(): Promise<string> {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  return tz && isValidTimeZone(tz) ? tz : FALLBACK_TZ;
}
