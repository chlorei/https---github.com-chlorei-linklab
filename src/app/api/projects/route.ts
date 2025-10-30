import { NextResponse } from "next/server";
import * as ProjectController from "@/lib/controllers/project.controller";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const projects = await ProjectController.getProjectsByUser(userId);
    return NextResponse.json(projects, { status: 200 });
  } catch (e) {
    console.error("Error fetching projects:", e);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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