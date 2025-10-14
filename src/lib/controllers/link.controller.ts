import * as LinkService from "@/lib/services/link.service";

interface CreateLinkBody {
  originalUrl?: string;
}

export async function create(body: CreateLinkBody, origin: string) {
  const originalUrl = body?.originalUrl?.toString().trim();
  if (!originalUrl) throw new Error("originalUrl is required");

  const link = await LinkService.createShortLink(originalUrl);
  const shortUrl = `${origin}/${link.shortId}`;
  return { ok: true, link, shortUrl };
}

export async function list() {
  return LinkService.list();
}