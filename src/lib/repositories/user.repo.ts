import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";

export async function addOne(doc: { originalUrl: string; shortId: string }) {
  await dbConnect();
  return Link.create({ ...doc, isActive: true, clicksCount: 0 });
}

export async function findAll() {
  await dbConnect();
  return Link.find().sort({ createdAt: -1 }).lean();
}