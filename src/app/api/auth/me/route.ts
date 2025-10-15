import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1];
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { id: string; email: string; name?: string };
    return NextResponse.json({ ok: true, user: decoded });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}