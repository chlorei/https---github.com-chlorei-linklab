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


/**
 * Считает визиты за последние 7 дней по массиву ссылок.
 * Возвращает [{ day: "Mon", date: "2025-10-14", count: 15 }, ...]
 */

// export async function countVisitsLast7Days(linkIds: string[], timezone = "Europe/Berlin") {
//   await dbConnect();

//   const ids = linkIds.filter(Types.ObjectId.isValid).map(id => new Types.ObjectId(id));
//   if (!ids.length) return [];

//   // последние 7 дней
//   const end = dayjs().tz(timezone).endOf("day").toDate();
//   const start = dayjs().tz(timezone).subtract(6, "day").startOf("day").toDate();

//   // ✅ используем ts вместо createdAt
//   const rows = await Visit.aggregate([
//     { $match: { linkId: { $in: ids }, ts: { $gte: start, $lte: end } } },
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             format: "%Y-%m-%d",
//             date: "$ts",
//             timezone,
//           },
//         },
//         count: { $sum: 1 },
//       },
//     },
//     { $project: { _id: 0, date: "$_id", count: 1 } },
//     { $sort: { date: 1 } },
//   ]);

//   const map = new Map(rows.map(r => [r.date, r.count]));

//   // последовательность 7 дней (с нулями)
//   const series = Array.from({ length: 7 }).map((_, i) => {
//     const d = dayjs().tz(timezone).subtract(6 - i, "day");
//     const date = d.format("YYYY-MM-DD");
//     const weekday = d.format("ddd");
//     return { date, weekday, count: map.get(date) ?? 0 };
//   });

//   return series;
// }

export async function countVisitsLast7Days(linkIds: string[], timezone = "Europe/Berlin") {
  await dbConnect();

  const ids = linkIds.filter(Types.ObjectId.isValid).map(id => new Types.ObjectId(id));
  if (!ids.length) return [];

  const end = dayjs().tz(timezone).endOf("day").toDate();
  const start = dayjs().tz(timezone).subtract(6, "day").startOf("day").toDate();

  // группировка по дате из поля ts
  const rows = await Visit.aggregate([
    { $match: { linkId: { $in: ids }, ts: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$ts", timezone },
        },
        clicks: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", clicks: 1 } },
    { $sort: { date: 1 } },
  ]);

  // превращаем даты в дни недели и добавляем пропущенные
  const map = new Map(rows.map(r => [r.date, r.clicks]));
  const result = Array.from({ length: 7 }).map((_, i) => {
    const d = dayjs().tz(timezone).subtract(6 - i, "day");
    const date = d.format("YYYY-MM-DD");
    const day = d.format("ddd"); // Mon, Tue, Wed...
    return {
      day,
      clicks: map.get(date) ?? 0,
    };
  });

  return result;
}