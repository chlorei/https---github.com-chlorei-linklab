import Visit from "@/lib/db/models/Visit";
import { removeById } from "@/lib/services/link.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST (request: Request) {
    const { linkId } = await request.json();
    await removeById(linkId);
    await Visit.deleteMany({ linkId });
    return new Response(null, { status: 204 });
    }

    