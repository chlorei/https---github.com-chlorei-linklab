import "server-only";
import { Types } from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import Project from "@/lib/db/models/Project";
import { HttpError } from "@/lib/auth/auth";
import { projectFieldsSchema, projectPatchSchema } from "@/lib/validation";

export type ProjectItem = {
  _id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
};

type ProjectLean = {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  color?: string;
  createdAt?: Date;
};

function toProjectItem(doc: ProjectLean): ProjectItem {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description ?? "",
    color: doc.color ?? "mint",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

/**
 * Creates a project for the user.
 * @param input untrusted `{ title, description?, color? }`, validated with `projectFieldsSchema`
 */
export async function createProject(userId: string, input: unknown): Promise<ProjectItem> {
  const data = projectFieldsSchema.parse(input);
  await dbConnect();
  const doc = await Project.create({ ...data, userId });
  return toProjectItem(doc.toObject());
}

/** The user's non-archived projects, newest first. */
export async function listProjects(userId: string): Promise<ProjectItem[]> {
  await dbConnect();
  const docs = await Project.find({ userId, isArchived: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean<ProjectLean[]>();
  return docs.map(toProjectItem);
}

/**
 * Applies a partial update to one of the user's projects.
 * @param input untrusted `{ title?, description?, color? }`, validated with `projectPatchSchema`
 * @throws HttpError 400 if nothing to update, 404 if the project isn't the user's
 */
export async function updateProject(userId: string, projectId: Types.ObjectId, input: unknown): Promise<ProjectItem> {
  const patch = projectPatchSchema.parse(input);
  if (Object.keys(patch).length === 0) throw new HttpError(400, "No fields to update");

  await dbConnect();
  const doc = await Project.findOneAndUpdate(
    { _id: projectId, userId },
    { $set: patch },
    { new: true, runValidators: true }
  ).lean<ProjectLean>();
  if (!doc) throw new HttpError(404, "Project not found");
  return toProjectItem(doc);
}

/** Deletes the project; its links are kept and become unassigned. */
export async function deleteProject(userId: string, projectId: Types.ObjectId) {
  await dbConnect();
  const res = await Project.deleteOne({ _id: projectId, userId });
  if (res.deletedCount === 0) throw new HttpError(404, "Project not found");
  await Link.updateMany({ projectId, userId }, { $set: { projectId: null } });
}
