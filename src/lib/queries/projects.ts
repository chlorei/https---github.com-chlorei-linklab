"use server";

import { serializeMongo } from "@/app/utils/serializeMongo";
import dbConnect from "@/lib/db/dbConnect";
import Project from "@/lib/db/models/Project";



export default async function getProjects(userId: string) {
    await dbConnect();
  const rawProjects = await Project.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const projects = serializeMongo(rawProjects);
  return projects;
}


