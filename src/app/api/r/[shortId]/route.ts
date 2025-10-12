import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Link from "@/db/models/Link";
import Visit from "@/db/models/Visit";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { shortId: string } }
) {
  await dbConnect();
  const { shortId } = params;

  const link = await Link.findOne({ shortId, isActive: true }).lean();
  if (!link) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // сохраняем визит (fire-and-forget)
  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  const ua = req.headers.get("user-agent") ?? undefined;
  Visit.create({ linkId: link._id, ip, userAgent: ua }).catch(() => {});

  // обновляем счётчик
  await Link.updateOne({ _id: link._id }, { $inc: { clicksCount: 1 } });

  // редиректим на оригинальный URL
  return NextResponse.redirect(link.originalUrl, 302);
}