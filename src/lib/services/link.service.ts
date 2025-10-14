import * as Repo from "@/lib/repositories/link.repo";

export async function createShortLink(originalUrl: string) {
  const shortId = Math.random().toString(36).slice(2, 8);
  return Repo.insert({ originalUrl, shortId });
}

export async function list() {
  return Repo.findAll();
}
