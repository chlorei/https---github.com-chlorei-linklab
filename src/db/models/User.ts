import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Link from "@/db/models/Link";
import { zCreateLink } from "@/features/links/validators";
import { normalizeUrl, generateShortId } from "@/features/links/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const data = zCreateLink.parse(body);

    const doc = await Link.create({
      originalUrl: normalizeUrl(data.originalUrl),
      shortId: data.shortId ?? generateShortId(),
      domain: data.domain ?? null,
      title: data.title ?? null,
    });
    return NextResponse.json({ ok: true, link: doc }, { status: 201 });
  } catch (e: any) {
    const status = e?.code === 11000 ? 409 : 400;
    return NextResponse.json({ ok: false, error: e.message ?? String(e) }, { status });
  }
}

export async function GET() {
  await dbConnect();
  const links = await Link.find().sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ ok: true, links });
}