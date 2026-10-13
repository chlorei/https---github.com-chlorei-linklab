import { NextResponse } from "next/server";
import { signIn } from "@/lib/services/user.service";
import { handleRouteError, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await readJson(req)) as { email?: unknown; password?: unknown } | null;
    const user = await signIn(
      typeof body?.email === "string" ? body.email : "",
      typeof body?.password === "string" ? body.password : ""
    );
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return handleRouteError(err, "login");
  }
}
