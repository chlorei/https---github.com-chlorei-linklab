import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import { Types } from "mongoose";

export type InsertLinkInput = {
  originalUrl: string;
  shortId: string;
  title?: string | null;
  domain?: string | null;
  userId: string | null; 
};

export async function insert(doc: InsertLinkInput) {
  await dbConnect();
  return Link.create({ ...doc, isActive: true, clicks: 0 });
}

export async function findAll() {
  await dbConnect();
  return Link.find().sort({ createdAt: -1 }).lean();
}


export async function findByUserId(userId: string) {
  await dbConnect();

  if (!userId) return [];

  return Link.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean();
}

export async function deleteById(linkId: string) {
  await dbConnect();
  return Link.deleteOne({ _id: new Types.ObjectId(linkId) });
}