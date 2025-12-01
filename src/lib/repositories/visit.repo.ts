import dbConnect from "@/lib/db/dbConnect";
import Visit from "../db/models/Visit";
import { Types } from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);

export type AddVisit = {
  linkId: Types.ObjectId;
  ts?: Date;
  ip?: string;
  userAgent?: string;
  creatorUserId?: Types.ObjectId;
  projectId?: Types.ObjectId;
};

export async function addOne({doc: addVisit} : {doc: AddVisit} ) {
  await dbConnect();
  return Visit.create(addVisit);
}

export async function findAll() {
  await dbConnect();
  return Visit.find().sort({ createdAt: -1 }).lean();
}


export async function findAllByLinkId(linkId: Types.ObjectId) {
  await dbConnect();
  return Visit.find({ linkId }).sort({ createdAt: -1 }).lean();
}


export async function countByLinkId(linkId: Types.ObjectId) {
  await dbConnect();
  return Visit.countDocuments({ linkId });
}


export async function countByUserId(userId: Types.ObjectId) {
  await dbConnect();
  return Visit.countDocuments({creatorUserId: userId});
}