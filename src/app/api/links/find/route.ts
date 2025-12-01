// import { NextResponse } from "next/server";
// import * as LinkController from "@/lib/controllers/link.controller";
// // import mongoose from "mongoose"; // если нужно валидировать ObjectId

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const projectid = searchParams.get("projectid");

//   // if (!projectid) {
//   //   return NextResponse.json({ error: "Missing projectid" }, { status: 400 });
//   // }

  

//   // если Mongo ObjectId:
//   // if (!mongoose.Types.ObjectId.isValid(projectid)) {
//   //   return NextResponse.json({ error: "Invalid projectid" }, { status: 400 });
//   // }

//   try {
//     if (projectid === "null") {
//       const links = await LinkController.listByProjectId(null);
//       return NextResponse.json(links, { status: 200 });
//     }
//     const link = await LinkController.listByProjectId(projectid);
//     return NextResponse.json(link, { status: 200 });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import * as LinkController from "@/lib/controllers/link.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectid = searchParams.get("projectid");

  try {
    let links;

    // нет projectid в строке запроса ИЛИ он равен строке "null" → считаем, что это "без проекта"
    if (!projectid || projectid === "null") {
      links = await LinkController.listByProjectId(null);
      console.log("Links for null project:", links);
    } else {
      links = await LinkController.listByProjectId(projectid);
      console.log("Links for GAY", projectid, links);
    }

    return NextResponse.json(links, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}