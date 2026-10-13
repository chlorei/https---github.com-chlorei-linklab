const SENTINEL_ORIGIN = "https://relinxr.invalid";

/**
 * Returns `value` as a same-origin path (`/path?query#hash`) or `fallback`, so `?next=`
 * can't be used as an open redirect.
 *
 * String checks alone aren't enough: browsers' URL parsers drop tabs/newlines and treat
 * `\` like `/`, so e.g. "/\t/evil.com" becomes "//evil.com". Resolving with the same URL
 * parser and comparing origins catches every such variant.
 */
export function safeNextPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  try {
    const url = new URL(value, SENTINEL_ORIGIN);
    if (url.origin !== SENTINEL_ORIGIN) return fallback;
    // re-serialized by the parser, so no control characters survive
    const path = `${url.pathname}${url.search}${url.hash}`;
    // dot-segment normalization can itself produce "//host" (e.g. "/.//evil.com")
    if (path.startsWith("//") || new URL(path, SENTINEL_ORIGIN).origin !== SENTINEL_ORIGIN) return fallback;
    return path;
  } catch {
    return fallback;
  }
}
