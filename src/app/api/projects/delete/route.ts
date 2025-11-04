import Link from "@/lib/db/models/Link";
import Project from "@/lib/db/models/Project";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST (request: Request) {
    const body = await request.json();
    const { projectId } = body;
    await Link.updateMany(
            { projectId: new Types.ObjectId(projectId) },
            { $set: { projectId: null } }
        );
    const projectRemove = await Project.deleteOne({ _id: new Types.ObjectId(projectId) });
    return NextResponse.json({ ok: true, projectRemove: projectRemove  }, { status: 200 });
    }
