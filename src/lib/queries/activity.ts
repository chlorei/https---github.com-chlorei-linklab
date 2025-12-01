// lib/queries/activity.ts
import "server-only";
import dbConnect from "@/lib/db/dbConnect";
import Visit from "@/lib/db/models/Visit";
import { Types } from "mongoose";

/**
 * Возвращает массив из N (=7) точек { day: "Mon", clicks: number }
 * по визитам пользователя за последние N дней.
 */
export async function getLast7DaysVisitsByUser(
  userId: string,
  tz: string = "Europe/Berlin",
  days: number = 7
): Promise<Array<{ day: string; clicks: number }>> {
  await dbConnect();
  const uid = new Types.ObjectId(userId);

  // Конец — сегодня 23:59:59 в tz, начало — (days-1) дней назад 00:00:00 в tz
  const now = new Date();
  const endLocalStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // YYYY-MM-DD
  const end = new Date(`${endLocalStr}T23:59:59.999Z`);

  const startDate = new Date(end);
  startDate.setUTCDate(end.getUTCDate() - (days - 1));
  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);

  // Агрегация: матч по пользователю и диапазону, группировка по дню (в tz)
  const rows = await Visit.aggregate([
    { $match: { creatorUserId: uid, createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: tz,
          },
        },
        clicks: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", clicks: 1 } },
  ]);

  // Заполним пропуски нулями и сделаем подписи дней недели
  const map = new Map<string, number>(rows.map(r => [r.date as string, r.clicks as number]));
  const out: Array<{ day: string; clicks: number }> = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(end); // копия
    d.setUTCDate(end.getUTCDate() - (days - 1 - i));
    d.setUTCHours(12, 0, 0, 0); // середина дня, чтобы избежать пограничных сдвигов

    const dateKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d); // YYYY-MM-DD

    const label = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: tz,
    }).format(d); // Mon/Tue/...

    out.push({ day: label, clicks: map.get(dateKey) ?? 0 });
  }

  return out;
}


export async function getLast7DaysVisitsByProject(
  projectId: string,
  tz: string = "Europe/Berlin",
  days: number = 7
): Promise<Array<{ day: string; clicks: number }>> {
  await dbConnect();
  const pid = new Types.ObjectId(projectId);

  const now = new Date();
  const endLocalStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // YYYY-MM-DD
  const end = new Date(`${endLocalStr}T23:59:59.999Z`);

  const startDate = new Date(end);
  startDate.setUTCDate(end.getUTCDate() - (days - 1));
  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);

  const rows = await Visit.aggregate([
    { 
      $match: { 
        projectId: pid,               // 👈 вот тут ключевое изменение
        createdAt: { $gte: start, $lte: end } 
      } 
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: tz,
          },
        },
        clicks: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", clicks: 1 } },
  ]);

  const map = new Map<string, number>(rows.map(r => [r.date as string, r.clicks as number]));
  const out: Array<{ day: string; clicks: number }> = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - (days - 1 - i));
    d.setUTCHours(12, 0, 0, 0);

    const dateKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

    const label = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: tz,
    }).format(d);

    out.push({ day: label, clicks: map.get(dateKey) ?? 0 });
  }

  return out;
}