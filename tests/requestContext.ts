/** In-memory stand-in for the cookies/headers of the "current request" in tests. */
export const cookieJar = new Map<string, string>();
export const requestHeaders = new Map<string, string>();

export function resetRequest(opts: { ip?: string; userAgent?: string } = {}) {
  cookieJar.clear();
  requestHeaders.clear();
  requestHeaders.set("x-forwarded-for", opts.ip ?? "203.0.113.1");
  requestHeaders.set("user-agent", opts.userAgent ?? "vitest");
}

export const cookiesApi = {
  get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined),
  set: (name: string, value: string, opts?: { maxAge?: number }) => {
    if (opts?.maxAge === 0 || value === "") cookieJar.delete(name);
    else cookieJar.set(name, value);
  },
};

export const headersApi = { get: (name: string) => requestHeaders.get(name.toLowerCase()) ?? null };
