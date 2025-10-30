import * as Repo from  "@/lib/repositories/project.repo"


export async function createProject(userId: string, title: string, description?: string, color?: string) {
    return Repo.createProject(userId, title, description, color);
}

export async function getProjectsByUser(userId: string) {
    return Repo.getProjectsByUser(userId);
}

export async function archiveProject(projectId: string) {
    return Repo.archiveProject(projectId);
}

export async function getProjectById(projectId: string) {
    return Repo.getProjectById(projectId);
}

export async function updateProject(projectId: string, updates: { title?: string; description?: string; color?: string }) {
    return Repo.updateProject(projectId, updates);
}

export async function deleteProject(projectId: string) {
    return Repo.deleteProject(projectId);
}
