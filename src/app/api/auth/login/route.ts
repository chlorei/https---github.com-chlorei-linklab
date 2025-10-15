

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as AuthController from "@/lib/controllers/auth.controller";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const generateAccessToken = (user: { id: string; email: string, name: string}) => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(user, secret, { expiresIn: "70h" });
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.email || !body.password) {
      return NextResponse.json({ ok: false, error: "Missing email or password" }, { status: 400 });
    }

    const userResult = await AuthController.findOneByEmail(body.email); // см. чтобы реально findOne
    const user = Array.isArray(userResult) ? userResult[0] : userResult;
    if (!user) {
      return NextResponse.json({ ok: false, error: "User with this email does not exist" }, { status: 404 });
    }

    const valid = bcrypt.compareSync(body.password, user.password);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const token = generateAccessToken({ id: String(user._id), email: user.email, name: user.name ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() });

    const res = NextResponse.json({
      ok: true,
      user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 70 * 60 * 60, // 70 часов
    });

    return res;
  } catch (e: unknown) {
    const error = e as { message?: string };
    return NextResponse.json({ ok: false, error: error?.message ?? "Internal error" }, { status: 500 });
  }
}