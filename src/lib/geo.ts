// No "server-only" import: also used by scripts/ outside of Next.js.
import { IPinfoWrapper } from "node-ipinfo";
import { countryCodeToNameMap } from "@/app/utils/countryMap";

export const UNKNOWN_COUNTRY = "Unknown";

let client: IPinfoWrapper | null | undefined;

function ipinfo() {
  if (client === undefined) {
    const token = process.env.IPINFO_API_TOKEN;
    client = token ? new IPinfoWrapper(token) : null;
  }
  return client;
}

/** First address of an x-forwarded-for style value ("client, proxy1, ..."). */
export function firstIp(value: string | null | undefined): string | undefined {
  return value?.split(",")[0]?.trim() || undefined;
}

/** Country name for an IP via IPinfo; "Unknown" when there's no IP, no token, or the lookup fails. */
export async function lookupCountry(ip: string | null | undefined): Promise<string> {
  const api = ipinfo();
  const addr = firstIp(ip);
  if (!addr || !api) return UNKNOWN_COUNTRY;
  try {
    const { countryCode } = await api.lookupIp(addr);
    return countryCodeToNameMap[countryCode as keyof typeof countryCodeToNameMap] ?? UNKNOWN_COUNTRY;
  } catch (err) {
    console.error("IPinfo lookup failed:", err);
    return UNKNOWN_COUNTRY;
  }
}
