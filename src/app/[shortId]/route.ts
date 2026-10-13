import { after, NextRequest, NextResponse } from "next/server";
import { findActiveLink } from "@/lib/services/link.service";
import { recordVisit } from "@/lib/services/analytics.service";
import { firstIp, lookupCountry } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHORT_ID_RE = /^[a-z0-9]{4,32}$/i;

function isServerSideRender(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  return /node\.js|vercel|next\.js|react-renderer/i.test(ua);
}

// Link-preview fetchers and crawlers: redirect them, but don't count them as clicks.
const BOT_UA_RE =
  /bot\b|crawler|spider|preview|facebookexternalhit|slack|telegram|whatsapp|discord|skypeuripreview|embedly|vkshare|headless|curl\/|wget\/|python-requests/i;

function isBot(req: NextRequest) {
  return BOT_UA_RE.test(req.headers.get("user-agent") || "");
}

function isPrefetch(req: NextRequest) {
  const h = req.headers;
  return (
    h.get("purpose") === "prefetch" ||
    h.get("sec-purpose") === "prefetch" ||
    h.get("next-router-prefetch") === "1"
  );
}

function clientIp(req: NextRequest) {
  return firstIp(req.headers.get("x-forwarded-for")) || req.headers.get("x-real-ip") || undefined;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortId: string }> }
): Promise<Response> {
  if (isPrefetch(request) || isServerSideRender(request)) {
    return new NextResponse(null, { status: 204 });
  }

  const { shortId } = await context.params;
  if (!SHORT_ID_RE.test(shortId)) return new NextResponse("Not Found", { status: 404 });

  const link = await findActiveLink(shortId);
  if (!link) return new NextResponse("Not Found", { status: 404 });

  if (!isBot(request)) {
    // read request data now; it isn't available once the response has been sent
    const ip = clientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // Runs after the 302 is sent (waitUntil on Vercel), so the IPinfo lookup and
    // DB writes never delay the redirect. Failures are logged, never surfaced.
    after(async () => {
      try {
        await recordVisit(link, { ip, userAgent, countryName: await lookupCountry(ip) });
      } catch (err) {
        console.error("Failed to record visit:", err);
      }
    });
  }

  const res = NextResponse.redirect(link.originalUrl, { status: 302 });
  // don't let browsers/CDNs cache the redirect, or repeat clicks wouldn't be counted
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
