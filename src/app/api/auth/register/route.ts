import { NextResponse } from "next/server";
import * as AuthController from "@/lib/controllers/auth.controller"

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {

    const body = await req.json().catch(() => null);

    if (!body || !body.email || !body.password) {
        return NextResponse.json(
            { message: "Invalid request: missing fields" },
            { status: 400 }
        );
        
}

 const existingUser = await AuthController.findOneByEmail(body.email);
    if (existingUser) {
        return NextResponse.json(
            { ok: false, message: "User with this email already exists" },
            { status: 409 }
        );
    }
    const result = await AuthController.create(body);


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
  const users = await AuthController.findAll();
  return NextResponse.json({ ok: true, users });
}