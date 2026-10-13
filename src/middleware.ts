import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Pages that require a signed-in user. API routes check the session themselves.
export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*", "/links/:path*", "/projects/:path*"],
  runtime: "nodejs",
};

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function hasValidToken(token: string | undefined) {
  if (!token || !process.env.JWT_SECRET) return false;
  try {
    // full revocation check (Session collection) happens in getSession() on the page
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    return typeof payload === "object" && Boolean(payload.jti);
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  if (req.cookies.get("agreementAccepted")?.value !== "true") {
    return redirectTo(req, "/agreement");
  }
  if (!hasValidToken(req.cookies.get("token")?.value)) {
    return redirectTo(req, "/signin");
  }
  return NextResponse.next();
}
