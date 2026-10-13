import { describe, expect, it } from "vitest";
import { Types } from "mongoose";
import Link from "@/lib/db/models/Link";
import Visit from "@/lib/db/models/Visit";
import {
  assignLinksToProject,
  createLink,
  deleteLink,
  detachLinkFromProject,
  listLinksByUser,
} from "@/lib/services/link.service";
import { createProject, deleteProject, listProjects, updateProject } from "@/lib/services/project.service";
import { RateLimitError } from "@/lib/rateLimit";
import { resetRequest } from "./requestContext";
import { makeUser } from "./helpers";

const oid = (id: string) => new Types.ObjectId(id);
const anon = { anonKey: "a".repeat(64) };

describe("links", () => {
  it("creates links with unique short ids", async () => {
    const user = await makeUser();
    const links = await Promise.all(Array.from({ length: 20 }, () => createLink({ userId: user.id }, { originalUrl: "example.com" })));
    expect(new Set(links.map((l) => l.shortId)).size).toBe(20);
    expect(links[0].originalUrl).toBe("https://example.com");
  });

  it("lists only the caller's links", async () => {
    const a = await makeUser();
    const b = await makeUser();
    await createLink({ userId: a.id }, { originalUrl: "a.example.com" });
    await createLink({ userId: b.id }, { originalUrl: "b.example.com" });
    expect((await listLinksByUser(a.id)).map((l) => l.originalUrl)).toEqual(["https://a.example.com"]);
  });

  it("does not let a user delete someone else's link", async () => {
    const owner = await makeUser();
    const attacker = await makeUser();
    const link = await createLink({ userId: owner.id }, { originalUrl: "example.com" });

    await expect(deleteLink({ userId: attacker.id }, oid(link._id))).rejects.toMatchObject({ status: 404 });
    expect(await Link.exists({ _id: link._id })).not.toBeNull();
  });

  it("deleting a link also deletes its visits", async () => {
    const user = await makeUser();
    const link = await createLink({ userId: user.id }, { originalUrl: "example.com" });
    await Visit.create({ linkId: link._id, creatorUserId: user.id });

    await deleteLink({ userId: user.id }, oid(link._id));
    expect(await Visit.countDocuments({ linkId: link._id })).toBe(0);
  });

  it("rate-limits anonymous link creation per IP", async () => {
    resetRequest({ ip: "192.0.2.99" });
    for (let i = 0; i < 10; i++) await createLink(anon, { originalUrl: "example.com" });
    await expect(createLink(anon, { originalUrl: "example.com" })).rejects.toBeInstanceOf(RateLimitError);

    resetRequest({ ip: "192.0.2.100" });
    await expect(createLink(anon, { originalUrl: "example.com" })).resolves.toBeTruthy();
  });

  it("anonymous links can't target a project", async () => {
    const user = await makeUser();
    const project = await createProject(user.id, { title: "P" });
    await expect(createLink(anon, { originalUrl: "example.com", projectId: project._id })).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe("projects", () => {
  it("can't create a link in someone else's project", async () => {
    const owner = await makeUser();
    const attacker = await makeUser();
    const project = await createProject(owner.id, { title: "P" });
    await expect(createLink({ userId: attacker.id }, { originalUrl: "example.com", projectId: project._id })).rejects.toMatchObject({
      status: 404,
    });
  });

  it("assigning links only moves the caller's own links into the caller's own project", async () => {
    const owner = await makeUser();
    const other = await makeUser();
    const project = await createProject(owner.id, { title: "P" });
    const mine = await createLink({ userId: owner.id }, { originalUrl: "mine.example.com" });
    const theirs = await createLink({ userId: other.id }, { originalUrl: "theirs.example.com" });

    expect(await assignLinksToProject(owner.id, oid(project._id), [mine._id, theirs._id])).toBe(1);
    expect((await Link.findById(theirs._id).lean<{ projectId: unknown }>())?.projectId).toBeNull();

    const otherProject = await createProject(other.id, { title: "Q" });
    await expect(assignLinksToProject(owner.id, oid(otherProject._id), [mine._id])).rejects.toMatchObject({ status: 404 });
  });

  it("detach and update are owner-only", async () => {
    const owner = await makeUser();
    const attacker = await makeUser();
    const project = await createProject(owner.id, { title: "P" });
    const link = await createLink({ userId: owner.id }, { originalUrl: "example.com", projectId: project._id });

    await expect(detachLinkFromProject(attacker.id, oid(link._id))).rejects.toMatchObject({ status: 404 });
    await expect(updateProject(attacker.id, oid(project._id), { title: "pwned" })).rejects.toMatchObject({ status: 404 });

    expect((await detachLinkFromProject(owner.id, oid(link._id))).projectId).toBeNull();
    expect((await updateProject(owner.id, oid(project._id), { title: "Renamed", color: "pink" })).title).toBe("Renamed");
  });

  it("validates color and title", async () => {
    const user = await makeUser();
    await expect(createProject(user.id, { title: "  " })).rejects.toThrow();
    await expect(createProject(user.id, { title: "P", color: "#ff0000" })).rejects.toThrow();
    expect((await createProject(user.id, { title: "P" })).color).toBe("mint");
  });

  it("deleting a project keeps its links, unassigned", async () => {
    const user = await makeUser();
    const project = await createProject(user.id, { title: "P" });
    const link = await createLink({ userId: user.id }, { originalUrl: "example.com", projectId: project._id });

    await deleteProject(user.id, oid(project._id));
    expect(await listProjects(user.id)).toEqual([]);
    expect((await listLinksByUser(user.id))[0]).toMatchObject({ _id: link._id, projectId: null });
  });
});
