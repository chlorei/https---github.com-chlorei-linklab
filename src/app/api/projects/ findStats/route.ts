import { NextResponse } from "next/server";
import { getLast7DaysVisitsByProject } from "@/lib/queries/activity";

export const runtime = 'nodejs';

export async function GET(req: Request){
    try{
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');
        if (!projectId){
            return NextResponse.json({ok: false, error: 'Project id is falsey'}, {status: 400});
    }

        const visits = await getLast7DaysVisitsByProject(projectId);
        return NextResponse.json({ok: true, visits});
    } catch (error) {
        return NextResponse.json({ok: false, error: error}, {status: 500});
    }

}
