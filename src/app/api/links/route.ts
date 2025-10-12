import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Link from "@/db/models/Link";

export const runtime = "nodejs";

// 1️⃣ Создание ссылки (POST)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { originalUrl } = await req.json();

    if (!originalUrl) {
      return NextResponse.json({ ok: false, error: "originalUrl is required" }, { status: 400 });
    }

    // создаём короткий ID (случайная строка из букв и цифр)
    const shortId = Math.random().toString(36).slice(2, 8);

    // сохраняем в MongoDB
    const link = await Link.create({ originalUrl, shortId });

    // возвращаем JSON
    return NextResponse.json({ ok: true, link });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}