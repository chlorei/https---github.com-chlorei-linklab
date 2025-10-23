import dbConnect from "../db/dbConnect";
import Location from "../db/models/Location";
import { Types } from "mongoose";

export async function addOne(title: string, clicks: number): Promise<void> {
  await dbConnect();
  await Location.create({ title, clicks });
}

export async function getAllByUserId(userId: Types.ObjectId): Promise<Location[]> {
  await dbConnect();
  return Location.find({ userId }).exec();
}