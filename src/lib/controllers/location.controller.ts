import Location from "@/lib/db/models/Location";
import { Types } from "mongoose";
import dbConnect from "../db/dbConnect";
export type LocationLean = {
  _id: Types.ObjectId;
  countryName: string;
  clicks: number;
  userId: Types.ObjectId | null;
  createdAt: Date | null;
};

export async function getAllLocationsByUserId(userId: string) {
 await dbConnect();
  return Location.find({ userId }).sort({ clicks: -1 }).lean().exec();
}



export async function getAllLocationsByProjectId(projectId: string) {
  await dbConnect();
  return Location.find({ projectId }).sort({ clicks: -1 }).lean().exec();
}