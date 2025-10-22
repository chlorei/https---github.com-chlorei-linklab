// app/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import Visit from "@/lib/db/models/Visit";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isPrefetch(req: NextRequest) {
  const h = req.headers;
  return (
    h.get("purpose") === "prefetch" ||
    h.get("sec-purpose") === "prefetch" ||
    h.get("next-router-prefetch") === "1"
  );
}

function isBot(ua: string | null) {
  return !!ua && /bot|crawler|spider|facebookexternalhit|slack|discord|twitter|telegram|linkedin|preview|whatsapp|embed|puppeteer|headless/i.test(ua);
}

function dayKey(tz = "Europe/Berlin", d = new Date()) {
  const s = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return s.replaceAll("/", "-"); // YYYY-MM-DD
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> } // ← строго под твои типы
): Promise<NextResponse> {
  const { shortId } = await params;
  if (!shortId) return NextResponse.json({ ok: false, error: "Missing shortId" }, { status: 400 });

  // не считаем префетч
  if (isPrefetch(req)) return new NextResponse(null, { status: 204 });

  await dbConnect();

  const link = await Link.findOne({ shortId, isActive: true }).lean<{ originalUrl: string; _id: unknown; userId: unknown }>();
  if (!link || !link.originalUrl) {
    // 404 — можно редирект на свою страницу 404
    return NextResponse.redirect(new URL("/404", req.url), { status: 302 });
  }

  const ua = req.headers.get("user-agent");
  const xff = req.headers.get("x-forwarded-for") || "";
  const ip = xff.split(",")[0]?.trim();

  // идемпотентный учёт: 1 визит в день на (linkId + ip) или (linkId + UA)
  if (!isBot(ua)) {
    const tz = "Europe/Berlin";
    const day = dayKey(tz);

    const filter: Record<string, unknown> = {
      linkId: new Types.ObjectId(link._id as string),
      day,
    };
    if (ip) filter.ip = ip;
    else if (ua) filter.userAgent = ua;

    const res = await Visit.updateOne(
      filter,
      {
        $setOnInsert: {
          creatorUserId: link.userId,
          userAgent: ua || undefined,
          createdAt: new Date(), // если timestamps: true — можно убрать
        },
      },
      { upsert: true }
    );

    // нормализуем upsert-инфо из Mongoose/Mongo
    const upserted = res.upsertedCount || (res.upsertedId ? 1 : 0) || 0;
    if (upserted === 1) {
      await Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } });
    }
  }

  return NextResponse.redirect(link.originalUrl, { status: 302 });
}