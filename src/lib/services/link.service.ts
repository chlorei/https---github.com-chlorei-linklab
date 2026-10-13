import "server-only";
import { randomInt } from "crypto";
import { Types } from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import Project from "@/lib/db/models/Project";
import Visit from "@/lib/db/models/Visit";
import { HttpError } from "@/lib/auth/auth";
import { createLinkSchema, idListSchema } from "@/lib/validation";
import { getClientIp, rateLimit, RULES } from "@/lib/rateLimit";

export type LinkItem = {
  _id: string;
  originalUrl: string;
  shortId: string;
  projectId: string | null;
  clicks: number;
  createdAt: string;
};

type LinkLean = {
  _id: Types.ObjectId;
  originalUrl: string;
  shortId: string;
  projectId?: Types.ObjectId | null;
  userId?: Types.ObjectId | null;
  clicks?: number;
  createdAt?: Date;
};

const SHORT_ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const SHORT_ID_LENGTH = 7;
const MAX_SHORT_ID_ATTEMPTS = 5;

function generateShortId() {
  let id = "";
  for (let i = 0; i < SHORT_ID_LENGTH; i++) id += SHORT_ID_ALPHABET[randomInt(SHORT_ID_ALPHABET.length)];
  return id;
}

/** Maps a lean Link document to the serializable shape passed to client components. */
export function toLinkItem(doc: LinkLean): LinkItem {
  return {
    _id: doc._id.toString(),
    originalUrl: doc.originalUrl,
    shortId: doc.shortId,
    projectId: doc.projectId ? doc.projectId.toString() : null,
    clicks: doc.clicks ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

/** Who a link belongs to: a signed-in user, or an anonymous browser (see lib/auth/anonymous.ts). */
export type LinkOwner = { userId: string } | { anonKey: string };

function ownerFilter(owner: LinkOwner) {
  return "userId" in owner ? { userId: owner.userId } : { anonKey: owner.anonKey, userId: null };
}

async function assertProjectOwner(userId: string, projectId: Types.ObjectId | string) {
  const owns = await Project.exists({ _id: projectId, userId });
  if (!owns) throw new HttpError(404, "Project not found");
}

/** Creates a short link. Anonymous links cannot belong to a project. */
export async function createLink(owner: LinkOwner, input: unknown, ip?: string): Promise<LinkItem> {
  if ("userId" in owner) await rateLimit("link-user", owner.userId, RULES.createLinkUser);
  else await rateLimit("link-anon", ip ?? (await getClientIp()), RULES.createLinkAnon);

  const { originalUrl, projectId } = createLinkSchema.parse(input);
  await dbConnect();

  if (projectId) {
    if (!("userId" in owner)) throw new HttpError(401, "Sign in to add links to a project");
    await assertProjectOwner(owner.userId, projectId);
  }

  for (let attempt = 0; attempt < MAX_SHORT_ID_ATTEMPTS; attempt++) {
    try {
      const doc = await Link.create({
        originalUrl,
        shortId: generateShortId(),
        userId: "userId" in owner ? owner.userId : null,
        anonKey: "anonKey" in owner ? owner.anonKey : null,
        projectId: projectId ?? null,
      });
      return toLinkItem(doc.toObject());
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  }
  throw new Error("Could not generate a unique short id");
}

/**
 * Links of `owner`, newest first.
 * @param limit maximum number of links; 0 means no limit
 */
export async function listLinks(owner: LinkOwner, limit = 0): Promise<LinkItem[]> {
  await dbConnect();
  const docs = await Link.find(ownerFilter(owner)).sort({ createdAt: -1 }).limit(limit).lean<LinkLean[]>();
  return docs.map(toLinkItem);
}

/** All links of a signed-in user, newest first. */
export function listLinksByUser(userId: string): Promise<LinkItem[]> {
  return listLinks({ userId });
}

/**
 * Deletes a link owned by `owner` and all of its visits.
 * @throws HttpError 404 if the link doesn't exist or belongs to someone else (indistinguishable on purpose)
 */
export async function deleteLink(owner: LinkOwner, linkId: Types.ObjectId) {
  await dbConnect();
  const res = await Link.deleteOne({ _id: linkId, ...ownerFilter(owner) });
  if (res.deletedCount === 0) throw new HttpError(404, "Link not found");
  await Visit.deleteMany({ linkId });
}

/**
 * Moves the given links into one of the user's projects. Ids of links owned by
 * other users are silently ignored.
 * @returns number of links actually moved
 * @throws HttpError 404 if the project isn't the user's
 */
export async function assignLinksToProject(userId: string, projectId: Types.ObjectId, linkIds: unknown) {
  const ids = idListSchema.parse(linkIds);
  await dbConnect();
  await assertProjectOwner(userId, projectId);
  const res = await Link.updateMany(
    { _id: { $in: ids }, userId },
    { $set: { projectId } }
  );
  return res.modifiedCount;
}

/**
 * Removes a link from its project (the link itself is kept).
 * @throws HttpError 404 if the link isn't the user's
 */
export async function detachLinkFromProject(userId: string, linkId: Types.ObjectId): Promise<LinkItem> {
  await dbConnect();
  const doc = await Link.findOneAndUpdate(
    { _id: linkId, userId },
    { $set: { projectId: null } },
    { new: true }
  ).lean<LinkLean>();
  if (!doc) throw new HttpError(404, "Link not found");
  return toLinkItem(doc);
}

/** Looks up an active link by short id for the public redirect; no ownership check. */
export async function findActiveLink(shortId: string) {
  await dbConnect();
  return Link.findOne({ shortId, isActive: true }).lean<LinkLean>();
}

/**
 * Moves links created anonymously in this browser into the user's account, together
 * with their visits (so they show up in the user's analytics). Returns how many moved.
 */
export async function claimAnonymousLinks(userId: string, anonKey: string): Promise<number> {
  await dbConnect();
  const ids = (await Link.find({ anonKey, userId: null }, { _id: 1 }).lean<{ _id: Types.ObjectId }[]>()).map((l) => l._id);
  if (ids.length === 0) return 0;

  await Link.updateMany({ _id: { $in: ids }, userId: null }, { $set: { userId, anonKey: null } });
  await Visit.updateMany({ linkId: { $in: ids } }, { $set: { creatorUserId: userId } });
  return ids.length;
}
