import "server-only";
import * as VisitController from "@/lib/controllers/visit.controller";

import { Types } from "mongoose";

export async function countByUserId(userId: string): Promise<number> {
  return VisitController.countByUserId(new Types.ObjectId(userId));
}