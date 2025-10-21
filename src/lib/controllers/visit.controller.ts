import * as Repo from "@/lib/repositories/visit.repo";
import { Types } from "mongoose";

export async function addOne(body: Repo.AddVisit) {
    return Repo.addOne({ doc: body });
}

export async function findAllByLinkId(linkId: Types.ObjectId) {
     if (!linkId) return [];

      return Repo.findAllByLinkId(linkId);
}

export async function countByLinkId(linkId: Types.ObjectId) {
    if (!linkId) return 0;
    console.log("Counting visits for linkId:", linkId);
    return Repo.countByLinkId(linkId);
}
export async function countByUserId(userId: Types.ObjectId) {
    if (!userId) return 0;
    console.log("Counting visits for userId:", userId);
    return Repo.countByUserId(userId);
}