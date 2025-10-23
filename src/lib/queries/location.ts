import "server-only";
import * as LocationController from "@/lib/controllers/location.controller";

export type LocationItem = {
  _id: string;
  countryName: string;
  clicks: number;
  userId: string | null;
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