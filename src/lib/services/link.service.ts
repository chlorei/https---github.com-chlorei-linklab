import * as Repo from "@/lib/repositories/link.repo";

export async function createShortLink(originalUrl: string, _userId: string | null = null) {
  const shortId = Math.random().toString(36).slice(2, 8);
  return Repo.insert({
    originalUrl, shortId,
    userId: _userId
  });
}

export async function list() {
  return Repo.findAll();
}

export async function listByUserId(userId: string) {
  return Repo.findByUserId(userId);
} 

export async function removeById(linkId: string) {
  return Repo.deleteById(linkId);
}