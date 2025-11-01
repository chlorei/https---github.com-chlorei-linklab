import { NextResponse } from "next/server";
import * as LinkController from "@/lib/controllers/link.controller";
// import mongoose from "mongoose"; // если нужно валидировать ObjectId

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectid = searchParams.get("projectid");

  if (!projectid) {
    return NextResponse.json({ error: "Missing projectid" }, { status: 400 });
  }

  if (projectid === "null") {
  const links = await LinkController.listByProjectId(null);
  return NextResponse.json(links, { status: 200 });
}

  // если Mongo ObjectId:
  // if (!mongoose.Types.ObjectId.isValid(projectid)) {
  //   return NextResponse.json({ error: "Invalid projectid" }, { status: 400 });
  // }

  try {
    const link = await LinkController.listByProjectId(projectid);
    return NextResponse.json(link, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}