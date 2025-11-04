import dbConnect from '../db/dbConnect';
import Project from '../db/models/Project';
import { Types } from 'mongoose';

export const createProject = async (userId: string, title: string, description?: string, color?: string) => {
    await dbConnect();
    const project = new Project({
        userId: new Types.ObjectId(userId),
        title,
        description,
        color,
    });
    await project.save();
    return project;
};


export const getProjectsByUser = async (userId: string) => {
    await dbConnect();
    const projects = await Project.find({ userId: new Types.ObjectId(userId), isArchived: false }).sort({ createdAt: -1 });
    return projects;
};

export const archiveProject = async (projectId: string) => {
    await dbConnect();
    const project = await Project.findByIdAndUpdate(
        new Types.ObjectId(projectId),
        { isArchived: true },
        { new: true }
    );
    return project;
};

export const getProjectById = async (projectId: string) => {
    await dbConnect();
    const project = await Project.findById(new Types.ObjectId(projectId));
    return project;
};

export const updateProject = async (projectId: string, updates: { title?: string; description?: string; color?: string }) => {
    await dbConnect();
    const project = await Project.findByIdAndUpdate(
        new Types.ObjectId(projectId),
        updates,
        { new: true }
    );
    return project;
};

export const deleteProject = async (projectId: string) => {
    await dbConnect();
    await Project.findByIdAndDelete(new Types.ObjectId(projectId));
};