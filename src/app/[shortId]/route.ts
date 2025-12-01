// src/app/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Link from "@/lib/db/models/Link";
import * as VisitController from "@/lib/controllers/visit.controller";
import { IPinfoWrapper } from 'node-ipinfo';
import dotenv from 'dotenv';
import { countryCodeToNameMap } from "@/app/utils/countryMap";
import Location from "@/lib/db/models/Location";

dotenv.config();

const IPINFO_TOKEN = process.env.IPINFO_API_TOKEN ?? ""; 

const ipinfoWrapper = new IPinfoWrapper(IPINFO_TOKEN);
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isServerSideRender(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  return /node\.js|vercel|next\.js|react-renderer/i.test(ua);
}

function isPrefetch(req: NextRequest) {
  const h = req.headers;
  return (
    h.get("purpose") === "prefetch" ||
    h.get("sec-purpose") === "prefetch" ||
    h.get("next-router-prefetch") === "1"
  );
}



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortId: string }> } 
): Promise<Response> {

  
  
  if (isPrefetch(request) || isServerSideRender(request)) {
    return new NextResponse(null, { status: 204 }); 
  }

  const { shortId } = await context.params;
  await dbConnect();
  const link = await Link.findOne({ shortId, isActive: true });
  if (!link ) {
  //   // return NextResponse.redirect(new URL('/404', request.url), { status: 302 });
  // return NextResponse.redirect('https://rld.bio/dashboard', { status: 302 });
  return new NextResponse("Not Found", { status: 404 });
  }


  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const ua = request.headers.get("user-agent") ?? undefined;

  let countryCode: string | null = 'XX'; 
  let countryName = countryCodeToNameMap[countryCode as keyof typeof countryCodeToNameMap] ?? "Unknown";
  console.log()
  if (ip && IPINFO_TOKEN) {
    try {
      const geoResponse = await ipinfoWrapper.lookupIp(ip);
      await (countryCode = geoResponse.countryCode || 'XX');  
      countryName = countryCodeToNameMap[countryCode as keyof typeof countryCodeToNameMap] ?? "Unknown";
    } catch (error) {
      console.error('IPinfo lookup failed:', error);
      countryCode = 'XX'; 
      countryName = countryCodeToNameMap[countryCode as keyof typeof countryCodeToNameMap] ?? "Obama";
    }
  }

  // await Visit.syncIndexes();
  // await Location.syncIndexes();
  await Promise.all([
    VisitController.addOne({ linkId: link._id, ip, userAgent: ua, creatorUserId: link.userId, projectId: link.projectId}),
    Location.updateOne({ countryName: countryName, userId: link.userId }, { $inc: { clicks: 1 } }, { upsert: true }),
    Link.updateOne({ _id: link._id }, { isActive: true, $inc: { clicks: 1 } }),
  ]);
  return NextResponse.redirect(link.originalUrl, { status: 302 });
}





