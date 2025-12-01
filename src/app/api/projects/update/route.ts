import { NextResponse } from "next/server";
import Project from "@/lib/db/models/Project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { projectId, title, description, color } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const update: Record<string, string> = {};

    if (typeof title === "string") {
      update.title = title.trim();
    }

    if (typeof description === "string") {
      update.description = description.trim();
    }

    if (typeof color === "string" && color.trim() !== "") {
      update.color = color.trim();
    }

    // если вдруг ничего не передали — смысла апдейтить нет
    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(projectId, update, {
      new: true,
    }).lean();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, project }, { status: 200 });
  } catch (err) {
    console.error("Project update error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}