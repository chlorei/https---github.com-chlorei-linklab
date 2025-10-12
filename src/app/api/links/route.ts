import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Link from "@/db/models/Link";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // обязательно парсим JSON и проваливаемся с 400, если поле не пришло
    const body = await req.json().catch(() => null);
    const originalUrl = body?.originalUrl?.toString().trim();

    if (!originalUrl) {
      return NextResponse.json(
        { ok: false, error: "originalUrl is required" },
        { status: 400 }
      );
    }

    const shortId = Math.random().toString(36).slice(2, 8);
    const link = await Link.create({ originalUrl, shortId, isActive: true, clicksCount: 0 });

    return NextResponse.json({ ok: true, link }, { status: 201 });
  } catch (err) {
    const e = err as { message?: string; code?: number };
    const status = e?.code === 11000 ? 409 : 500;
    return NextResponse.json({ ok: false, error: e?.message ?? "Internal error" }, { status });
  }
}

export async function GET() {
  await dbConnect();
  const links = await Link.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, links });
}