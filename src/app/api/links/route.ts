import { NextResponse } from "next/server";
import { headers } from "next/headers";
import * as LinkController from "@/lib/controllers/link.controller"
import { requireSession } from "@/lib/auth/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    const body = await req.json().catch(() => null);


    const result = await LinkController.create(body, origin)

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const e = err as { message?: string; code?: number };
    const status = e?.code === 11000 ? 409 : 500;
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Internal error" },
      { status }
    );
  }
}

export async function GET() {
  const session = await requireSession(); 
  const links = await LinkController.listByUserId(session.id);
  return NextResponse.json({ ok: true, links });
}


