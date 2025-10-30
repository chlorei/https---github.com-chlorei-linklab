"use server";

import dbConnect from "@/lib/db/dbConnect";
import {Project} from "@/lib/db/models/Project";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/auth"; // ⬅️ твой файл с getSession()
                                                     // путь подстрой под проект

export async function createProjectAction(formData: FormData) {
  const title = (formData.get("title") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();
  const color = (formData.get("color") || "").toString();

  // ✅ получаем юзера прямо из server-side сессии
  const user = await requireSession();

  if (!title) {
    return { ok: false, error: "TITLE_REQUIRED" };
  }

  await dbConnect();

  const doc = await Project.create({
    userId: user.id,
    title,
    description,
    color,
  });

  revalidatePath("/projects");

  return { ok: true, projectId: doc._id.toString() };
}


    
export async function getProjectsByUserId(userId: string) {
  await dbConnect();

  const projects = await Project.find({ userId }).sort({ createdAt: -1 }).lean();
  
  return projects;
}


