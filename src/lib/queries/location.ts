import "server-only";
import * as LocationController from "@/lib/controllers/location.controller";
// import Visit from "@/lib/db/models/Visit";
// import { Types } from "mongoose";

export type LocationItem = {
  _id: string;
  countryName: string;
  clicks: number;
  userId?: string | null;
  projectId?: string | null;
  createdAt: string | null;
};

export type LocationsWithTop = {
  all: LocationItem[];
  topCountry: { name: string; clicks: number } | null;
};

export async function getAllLocationsByUserId(userId: string): Promise<LocationsWithTop> {
  const rows = await LocationController.getAllLocationsByUserId(userId);
  console.log("Fetched locations from controller:", rows);
  const all: LocationItem[] = (rows ?? []).map((loc) => ({
    _id: loc._id?.toString() ?? "",
    countryName: loc.countryName ?? "Unknown",
    clicks: Number(loc.clicks ?? 0),
    userId: loc.userId ? loc.userId.toString() : null,
    createdAt: loc.createdAt ? new Date(loc.createdAt).toISOString() : null,
  }));

  // данные уже отсортированы в контроллере, но на всякий случай:
  all.sort((a, b) => b.clicks - a.clicks);

  const topCountry = all.length
    ? { name: all[0].countryName, clicks: all[0].clicks }
    : null;

  return { all, topCountry };
}

// type TopCountryParams = {
//   projectId: string;   // ObjectId
//   from?: Date;         // опционально
//   to?: Date;           // опционально
//   limit?: number;      // дефолт 5-10
// };

// async function getTopCountriesByProject({
//   projectId,
//   from,
//   to,
//   limit = 5,
// }: TopCountryParams) {
//   const projectObjId = new Types.ObjectId(projectId);

//   const matchDates: any = {};
//   if (from) matchDates.$gte = from;
//   if (to)   matchDates.$lte = to;

//   const matchVisit: any = {};
//   if (Object.keys(matchDates).length) matchVisit.createdAt = matchDates;

//   return Visit.aggregate([
//     // 1) Джоиним Link, чтобы отфильтровать визиты по проекту
//     {
//       $lookup: {
//         from: "links",
//         localField: "linkId",
//         foreignField: "_id",
//         as: "link",
//       },
//     },
//     { $unwind: "$link" },
//     { $match: { "link.projectId": projectObjId, ...matchVisit } },

//     // 2) Источник страны: Visit.country если есть, иначе Location.country
//     {
//       $lookup: {
//         from: "locations",
//         localField: "locationId",
//         foreignField: "_id",
//         as: "location",
//       },
//     },
//     { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
//     {
//       $addFields: {
//         countryResolved: {
//           $ifNull: ["$country", { $ifNull: ["$location.country", "UNK"] }],
//         },
//       },
//     },

//     // 3) Группировка
//     {
//       $group: {
//         _id: "$countryResolved",
//         visits: { $sum: 1 },

//         // если есть visitorId или userId — можно посчитать уникальных
//         uniqueVisitors: { $addToSet: "$visitorId" },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         country: "$_id",
//         visits: 1,
//         uniqueVisitors: { $size: "$uniqueVisitors" },
//       },
//     },
//     { $sort: { visits: -1 } },
//     { $limit: limit },
//   ]).exec();
// }