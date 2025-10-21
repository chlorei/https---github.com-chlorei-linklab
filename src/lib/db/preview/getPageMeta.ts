import * as cheerio from "cheerio";

export type PageMeta = {
  url: string;
  finalUrl: string;
  titleTag?: string;
  ogTitle?: string;
  twTitle?: string;
  h1?: string;
  description?: string;
};

const FETCH_TIMEOUT_MS = 3500;
const MAX_BYTES = 512_000; // 500KB

function abortableTimeout(ms: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(t) };
}

export async function fetchPageMeta(rawUrl: string): Promise<PageMeta | null> {
  try {
    const u = new URL(rawUrl);
    if (!/^https?:$/.test(u.protocol)) return null;

    const { signal, cancel } = abortableTimeout(FETCH_TIMEOUT_MS);
    const res = await fetch(u.toString(), {
      method: "GET",
      redirect: "follow",
      signal,
      headers: {
        "User-Agent": "RelinxrBot/1.0 (+analytics)",
        "Accept": "text/html,application/xhtml+xml",
      },
    }).finally(() => cancel());

    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return null;

    const reader = res.body?.getReader();
    let received = 0;
    const chunks: Uint8Array[] = [];
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          received += value.byteLength;
          if (received > MAX_BYTES) break;
          chunks.push(value);
        }
      }
    }
    const html = reader
      ? new TextDecoder("utf-8").decode(Buffer.concat(chunks as Uint8Array[]))
      : await res.text();

    const $ = cheerio.load(html);
    const titleTag = $("title").first().text()?.trim() || undefined;
    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
    const twTitle = $('meta[name="twitter:title"]').attr("content")?.trim();
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim();
    const h1 = $("h1").first().text()?.trim() || undefined;

    return {
      url: rawUrl,
      finalUrl: res.url || rawUrl,
      titleTag,
      ogTitle,
      twTitle,
      h1,
      description,
    };
  } catch {
    return null;
  }
}

export function pickBestTitle(meta: PageMeta | null): string | null {
  if (!meta) return null;
  const candidates = [
    meta.ogTitle,
    meta.twTitle,
    meta.titleTag,
    meta.h1,
  ]
    .filter(Boolean)
    .map(s => s!.replace(/\s+/g, " ").trim())
    .map(s => s!.slice(0, 140)); // не слишком длинно

  if (candidates.length) return candidates[0]!;
  try {
    const u = new URL(meta.finalUrl || meta.url);
    // fallback: домен + последний сегмент
    const tail = u.pathname.split("/").filter(Boolean).pop();
    return tail ? `${u.hostname} — ${decodeURIComponent(tail)}` : u.hostname;
  } catch {
    return null;
  }
}