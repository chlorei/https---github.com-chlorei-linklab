"use server"
import * as Repo from "@/lib/repositories/link.repo";

export async function createShortLink(
  originalUrl: string,
  userId: string | null = null,
  projectId?: string | null
) {
  const shortId = Math.random().toString(36).slice(2, 8);

  // Не передаём "" — только undefined/null или валидный id
  const safeProjectId = projectId && projectId.trim() !== "" ? projectId : null;

  // service
return Repo.insert({
  originalUrl,
  shortId,
  userId,                    // строка id пользователя
  projectId: safeProjectId ?? null,
});
}

export async function list() {
  return Repo.findAll();
}

export async function listByUserId(userId: string) {
  console.log("Listing links for userId:", userId);
  const links = await Repo.findByUserId(userId);
  console.log("Found links:", links);
  return Repo.findByUserId(userId);
}

export async function removeById(linkId: string) {
  return Repo.deleteById(linkId);
}

export async function getLinksByProjectId(projectId: string) {
  console.log("Listing links for projectId:", projectId);
  const links = await Repo.findByProjectId(projectId);
  console.log("Found links:", links);
  return Repo.findByProjectId(projectId);
}
