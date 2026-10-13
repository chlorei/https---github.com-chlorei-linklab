"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/auth";
import { createProject } from "@/lib/services/project.service";
import { actionError, type ActionResult } from "./result";

export async function createProjectAction(formData: FormData): Promise<ActionResult<{ projectId: string }>> {
  try {
    const user = await requireSession();
    const project = await createProject(user.id, {
      title: formData.get("title") ?? "",
      description: formData.get("description") ?? "",
      color: formData.get("color") || undefined,
    });
    revalidatePath("/projects");
    return { ok: true, data: { projectId: project._id } };
  } catch (err) {
    return actionError(err, "Failed to create project");
  }
}
