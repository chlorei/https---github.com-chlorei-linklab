import { NextResponse } from "next/server";
import * as ProjectController from "@/lib/controllers/project.controller";
import { requireSession } from "@/lib/auth/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session?.id) {
      return NextResponse.json({ ok: false, projects: [] }, { status: 401 });
    }

    const projects = await ProjectController.getProjectsByUser(session.id);

    return NextResponse.json({ ok: true, projects }, { status: 200 });
  } catch (e) {
    console.error("Error fetching projects:", e);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch projects", projects: [] },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, userId, color } = body;

    // можно временно брать userId из тела, если нет сессии
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

       // 🧩 Безопасная обработка projectId
    if (!body.projectId || body.projectId === "" || body.projectId === "null") {
      delete body.projectId; // просто убираем из запроса
    }

    
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 422 });
    }

    const project = await ProjectController.createProject(
      userId,
      title.trim(),
      (description ?? "").trim(),
      color
    );

    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    console.error("Error creating project:", e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}