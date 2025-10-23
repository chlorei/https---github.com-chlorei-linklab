import "server-only";
import * as LinkService from "@/lib/services/link.service";

export type LinkItem = {
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
};

type LinkDocument = {
  _id: string | { toString(): string };
  originalUrl: string;
  shortId: string;
  clicks?: number;
  createdAt?: string | Date;
};

export async function getLinksByUserId(userId: string): Promise<LinkItem[]> {
  const docs = await LinkService.listByUserId(userId);
  return docs.map((d) => {
    const doc = d as unknown as LinkDocument;
    return {
      _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
      originalUrl: doc.originalUrl,
      shortId: doc.shortId,
      clicks: doc.clicks ?? 0,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    };
  });
}

export async function removeLinkById(linkId: string): Promise<void> {
  await LinkService.removeById(linkId);
}

