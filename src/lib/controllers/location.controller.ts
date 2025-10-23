import Location from "@/lib/db/models/Location";
import { Types } from "mongoose";

export type LocationLean = {
  _id: Types.ObjectId;
  countryName: string;
  clicks: number;
  userId: Types.ObjectId | null;
  createdAt: Date | null;
};

export async function getAllLocationsByUserId(userId: string) {
  return Location.find({ userId }).sort({ clicks: -1 }).lean().exec();
}