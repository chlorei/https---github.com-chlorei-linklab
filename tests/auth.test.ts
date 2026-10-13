import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import {
  AUTH_COOKIE,
  createSession,
  destroySession,
  getSession,
  revokeUserSessions,
  signToken,
} from "@/lib/auth/auth";
import { cookieJar } from "./requestContext";
import { makeUser } from "./helpers";

describe("revocable sessions", () => {
  it("registration signs the user in", async () => {
    const user = await makeUser();
    expect(await getSession()).toEqual({ id: user.id, email: user.email, name: user.name });
  });

  it("logout revokes the token server-side, not just the cookie", async () => {
    await makeUser();
    const stolen = cookieJar.get(AUTH_COOKIE)!;

    await destroySession();
    expect(cookieJar.has(AUTH_COOKIE)).toBe(false);

    // replaying the old (still validly signed) token no longer works
    cookieJar.set(AUTH_COOKIE, stolen);
    expect(await getSession()).toBeNull();
  });

  it("revokeUserSessions keeps only the given session", async () => {
    const user = await makeUser();
    const first = cookieJar.get(AUTH_COOKIE)!;
    await createSession(user);
    const second = cookieJar.get(AUTH_COOKIE)!;
    const secondId = (jwt.decode(second) as { jti: string }).jti;

    expect(await revokeUserSessions(user.id, secondId)).toBe(1);

    cookieJar.set(AUTH_COOKIE, first);
    expect(await getSession()).toBeNull();
    cookieJar.set(AUTH_COOKIE, second);
    expect(await getSession()).not.toBeNull();
  });

  it("rejects legacy tokens without a session id and forged tokens", async () => {
    const user = await makeUser();
    cookieJar.set(AUTH_COOKIE, jwt.sign({ id: user.id, email: user.email, name: user.name }, "test-secret"));
    expect(await getSession()).toBeNull();

    cookieJar.set(AUTH_COOKIE, jwt.sign({ id: user.id, email: user.email, name: user.name, jti: "x" }, "wrong-secret"));
    expect(await getSession()).toBeNull();

    // correctly signed but for a session that was never created
    cookieJar.set(AUTH_COOKIE, signToken(user, "does-not-exist"));
    expect(await getSession()).toBeNull();
  });
});
