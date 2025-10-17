import * as LinkService from "@/lib/services/link.service";

interface CreateLinkBody {
  userId: null;
  originalUrl?: string;
}

export async function create(body: CreateLinkBody, origin: string) {
  const originalUrl = body?.originalUrl?.toString().trim();
  if (!originalUrl) throw new Error("originalUrl is required");

  const link = await LinkService.createShortLink(originalUrl, body?.userId ?? null);
  const shortUrl = `${origin}/${link.shortId}`;
  return { ok: true, link, shortUrl };
}

export async function list() {
  return LinkService.list();
}

export async function listByUserId(userId: string) {
  return LinkService.listByUserId(userId);
}