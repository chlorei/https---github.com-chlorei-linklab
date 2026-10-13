import { describe, expect, it } from "vitest";
import { Types } from "mongoose";
import Visit from "@/lib/db/models/Visit";
import { ANON_COOKIE, ensureAnonKey, getAnonKey, getLinkOwner } from "@/lib/auth/anonymous";
import { createLink, deleteLink, listLinks, listLinksByUser } from "@/lib/services/link.service";
import { signIn } from "@/lib/services/user.service";
import { countUserVisits } from "@/lib/services/analytics.service";
import { cookieJar, resetRequest } from "./requestContext";
import { makeUser } from "./helpers";

async function anonymousBrowser(ip = "192.0.2.10") {
  resetRequest({ ip });
  const owner = (await getLinkOwner({ create: true }))!;
  return { owner, cookie: cookieJar.get(ANON_COOKIE)! };
}

describe("anonymous links", () => {
  it("issues a stable anonymous key and stores only its hash", async () => {
    const { owner, cookie } = await anonymousBrowser();
    expect(cookie).toHaveLength(43);
    expect(await ensureAnonKey()).toBe((owner as { anonKey: string }).anonKey);
    expect((owner as { anonKey: string }).anonKey).not.toContain(cookie);
  });

  it("getLinkOwner prefers the signed-in user and doesn't create cookies by default", async () => {
    resetRequest();
    expect(await getLinkOwner()).toBeNull();
    expect(cookieJar.has(ANON_COOKIE)).toBe(false);

    const user = await makeUser();
    expect(await getLinkOwner({ create: true })).toEqual({ userId: user.id });
  });

  it("a browser can list and delete only its own anonymous links", async () => {
    const a = await anonymousBrowser("192.0.2.11");
    const linkA = await createLink(a.owner, { originalUrl: "a.example.com" });
    const b = await anonymousBrowser("192.0.2.12");
    const linkB = await createLink(b.owner, { originalUrl: "b.example.com" });

    expect((await listLinks(a.owner)).map((l) => l._id)).toEqual([linkA._id]);
    await expect(deleteLink(b.owner, new Types.ObjectId(linkA._id))).rejects.toMatchObject({ status: 404 });

    await deleteLink(b.owner, new Types.ObjectId(linkB._id));
    expect(await listLinks(b.owner)).toEqual([]);
  });

  it("signing in moves this browser's links and their visits into the account", async () => {
    const user = await makeUser();

    const browser = await anonymousBrowser();
    const link = await createLink(browser.owner, { originalUrl: "example.com" });
    await Visit.create({ linkId: link._id, countryName: "Germany" });
    const otherBrowser = await anonymousBrowser("192.0.2.77");
    await createLink(otherBrowser.owner, { originalUrl: "not-mine.example.com" });

    resetRequest();
    cookieJar.set(ANON_COOKIE, browser.cookie);
    await signIn(user.email, user.password);

    expect(cookieJar.has(ANON_COOKIE)).toBe(false);
    expect((await listLinksByUser(user.id)).map((l) => l._id)).toEqual([link._id]);
    expect(await countUserVisits(user.id)).toBe(1);
    expect(await listLinks(browser.owner)).toEqual([]);
    // the other browser's link stays anonymous
    expect(await listLinks(otherBrowser.owner)).toHaveLength(1);
  });

  it("registering also claims the links", async () => {
    const browser = await anonymousBrowser("192.0.2.20");
    await createLink(browser.owner, { originalUrl: "example.com" });

    cookieJar.set(ANON_COOKIE, browser.cookie);
    const user = await makeUserKeepingCookies();
    expect(await listLinksByUser(user.id)).toHaveLength(1);
    expect(await getAnonKey()).toBeNull();
  });
});

// makeUser() resets the request (and its cookies), so register directly here.
async function makeUserKeepingCookies() {
  const { registerUser } = await import("@/lib/services/user.service");
  return registerUser({ firstName: "A", lastName: "B", email: "claimer@example.com", password: "password123" });
}
