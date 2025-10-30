"use server"

import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import { Types } from "mongoose";

export type InsertLinkInput = {
  originalUrl: string;
  shortId: string;
  title?: string | null;
  domain?: string | null;
  userId?: string | null;        // строка или null
  projectId?: string | null;     // строка или null
};

function toObjectIdOrUndefined(id?: string | null) {
  if (!id) return undefined;
  if (!Types.ObjectId.isValid(id)) return undefined;
  return new Types.ObjectId(id);
}

export async function insert(doc: InsertLinkInput) {
  await dbConnect();

  return Link.create({
  originalUrl: doc.originalUrl,
  shortId: doc.shortId,
  userId: doc.userId || undefined,
  projectId: doc.projectId || undefined,
  isActive: true,
  clicks: 0,
});
}

export async function findAll() {
  await dbConnect();
  return Link.find().sort({ createdAt: -1 }).lean();
}


export async function findByUserId(userId: string) {
  await dbConnect();
  if (!userId) return [];

  // 💥 всегда преобразуем в ObjectId
  const objectId = new Types.ObjectId(userId);

  const links = await Link.find({ userId: objectId })
    .sort({ createdAt: -1 })
    .lean();

  return links;
}
export async function deleteById(linkId: string) {
  await dbConnect();
  if (!Types.ObjectId.isValid(linkId)) return { deletedCount: 0, acknowledged: true };
  return Link.deleteOne({ _id: new Types.ObjectId(linkId) });
}