import * as LinkService from "@/lib/services/link.service";

interface CreateLinkBody {
  userId?: string | null;        // ← а не "null" как тип
  originalUrl?: string;
  projectId?: string | null;     // ← явно допускаем null
}

export async function create(body: CreateLinkBody, origin: string) {
  const originalUrl = body?.originalUrl?.toString().trim();
  if (!originalUrl) throw new Error("originalUrl is required");

  // НИКАКИХ "" — только валидный id или null/undefined
  const userId    = body?.userId ?? null;
  const projectId = body?.projectId && body.projectId.trim() !== "" ? body.projectId : null;

  const link = await LinkService.createShortLink(originalUrl, userId, projectId);

  const shortUrl = `${origin}/${link.shortId}`;
  return { ok: true, link, shortUrl };
}

export async function list() {
  return LinkService.list();
}

export async function listByUserId(userId: string) {
  return LinkService.listByUserId(userId);
}