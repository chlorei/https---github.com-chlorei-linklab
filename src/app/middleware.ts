import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/api/protected/:path*"], // защищаем нужные эндпоинты
  runtime: "nodejs",
};

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return new NextResponse(JSON.stringify({ ok: false, message: "No token provided" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    const res = NextResponse.next();

    // пробрасываем данные юзера дальше через заголовки
    res.headers.set("x-user-id", decoded.id);
    res.headers.set("x-user-email", decoded.email);

    return res;
  } catch {
    return new NextResponse(JSON.stringify({ ok: false, message: "Invalid or expired token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}