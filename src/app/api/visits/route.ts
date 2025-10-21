import * as VisitController from "@/lib/controllers/visit.controller";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/auth";
import { Types } from "mongoose";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireSession();
    if (!session?.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
    try {
        const visits = await VisitController.countByUserId(new Types.ObjectId(session.id as string));
        return NextResponse.json({ ok: true, visits });
    } catch (error) {
        console.error("Error fetching visits:", error);
        return NextResponse.json({ ok: false, error: "Failed to fetch visits" }, { status: 500 });
    }
}