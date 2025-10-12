import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Link from "@/db/models/Link";

export const runtime = "nodejs";

// POST — создать новую короткую ссылку
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { originalUrl } = await req.json();

    if (!originalUrl) {
      return NextResponse.json(
        { ok: false, error: "originalUrl is required" },
        { status: 400 }
      );
    }

    // генерим короткий ID
    const shortId = Math.random().toString(36).slice(2, 8);

    // создаём запись
    const link = await Link.create({
      originalUrl,
      shortId,
      isActive: true,
      clicksCount: 0,
    });

    return NextResponse.json({ ok: true, link }, { status: 201 });
  } catch (err) {
    // ✅ объявляем тип явно, без any
    const e = err as { message?: string; code?: number };
    const msg = e.message ?? "Unknown error";
    const status = e.code === 11000 ? 409 : 500;

    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

// GET — получить список всех ссылок
export async function GET() {
  await dbConnect();
  const links = await Link.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, links });
}