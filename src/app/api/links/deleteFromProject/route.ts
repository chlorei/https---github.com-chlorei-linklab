import { NextResponse } from "next/server";
import * as LinkController from "@/lib/controllers/link.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const updated = await LinkController.detachFromProject(id);

    if (!updated) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, link: updated });
  } catch (err) {
    console.error("detachFromProject error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}