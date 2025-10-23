import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/api/protected/:path*",
    // Если хочешь — добавь ещё пути, которые должны требовать авторизацию
  ],
  runtime: "nodejs",
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const hasAccepted = req.cookies.get("agreementAccepted")?.value === "true";

  const isApi = req.nextUrl.pathname.startsWith("/api/");
  const isAgreementPage = req.nextUrl.pathname.startsWith("/agreement");
  const isSignin = req.nextUrl.pathname.startsWith("/signin");

  // 1️⃣ Проверяем — если пользователь не принял соглашение
  if (!hasAccepted && !isAgreementPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/agreement";
    return NextResponse.redirect(url);
  }

  // 2️⃣ Если токена нет
  if (!token) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ ok: false, error: "No token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!isSignin) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  // 3️⃣ Проверяем JWT
  try {
    if (token) jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    if (isApi) {
      return new NextResponse(JSON.stringify({ ok: false, error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
}