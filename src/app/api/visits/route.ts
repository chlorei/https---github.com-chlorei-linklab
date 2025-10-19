import * as VisitController from "@/lib/controllers/visit.controller";
import { listByUserId } from "@/lib/services/link.service";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireSession } from "@/lib/auth/auth";

export const runtime = "nodejs";

export async function GET() {
    try {
        const session = await requireSession()
        const links =  await listByUserId(session?.id);
        const linkIds = links.map(link => link._id as Types.ObjectId);

        let totalVisits = 0;
        
        for (const linkId of linkIds) {
            const count = await VisitController.countByLinkId(linkId);
            totalVisits += count;
            
        }
        console.log("Link IDs for visit count:", linkIds);
        const series = await VisitController.countVisitsLast7Days(linkIds.map(id => id.toString()), "Europe/Berlin");
        console.log("Visits series data:", series);
        return NextResponse.json({ ok: true, visits: totalVisits, series }, { status: 200 });

    } catch (error) {
        console.error("Error fetching visits:", error);
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
    }

}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || !body.linkId) {
            return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
        }

        const visitData = {
            linkId: new Types.ObjectId(body.linkId),
            ts: body.ts ? new Date(body.ts) : undefined,
            ip: body.ip,
            userAgent: body.userAgent,
        };

        const newVisit = await VisitController.addOne(visitData);        
        return NextResponse.json({ ok: true, visit: newVisit }, { status: 201 });
    } catch (err) {
        const e = err as { message?: string; code?: number };
        return NextResponse.json(
            { ok: false, error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }

}