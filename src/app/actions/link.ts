import Visit from "@/lib/db/models/Visit";
import * as LinkService from "@/lib/services/link.service";


export async function removeLinkById(linkId: string): Promise<void> {
    await LinkService.removeById(linkId);
    await Visit.deleteMany({ linkId });
}

export async function getLinksByProjectId(projectId: string) {
    return LinkService.getLinksByProjectId(projectId);
}