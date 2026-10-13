import { NextResponse } from "next/server";
import { registerUser } from "@/lib/services/user.service";
import { handleRouteError, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await registerUser(await readJson(req));
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "register");
  }
}
