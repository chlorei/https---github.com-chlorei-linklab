import { describe, expect, it } from "vitest";
import { HttpError, getCurrentSession, getSession, AUTH_COOKIE } from "@/lib/auth/auth";
import { changePassword, registerUser, signIn, updateProfile } from "@/lib/services/user.service";
import { RateLimitError } from "@/lib/rateLimit";
import { cookieJar, resetRequest } from "./requestContext";
import { makeUser } from "./helpers";

describe("registerUser", () => {
  it("rejects duplicate emails case-insensitively", async () => {
    const user = await makeUser();
    resetRequest({ ip: "192.0.2.50" });
    await expect(
      registerUser({ firstName: "A", lastName: "B", email: user.email.toUpperCase(), password: "password123" })
    ).rejects.toMatchObject({ status: 409 });
  });

  it("never returns the password hash", async () => {
    const user = await makeUser();
    expect(Object.keys(user).sort()).toEqual(["email", "id", "name", "password"]); // `password` comes from the helper
    expect(JSON.stringify(await getSession())).not.toMatch(/\$2[aby]\$/);
  });
});

describe("signIn", () => {
  it("accepts correct credentials and normalizes the email", async () => {
    const user = await makeUser();
    resetRequest();
    await signIn(`  ${user.email.toUpperCase()} `, user.password);
    expect((await getSession())?.id).toBe(user.id);
  });

  it("gives the same error for unknown email and wrong password", async () => {
    const user = await makeUser();
    const wrongPassword = await signIn(user.email, "wrong-password").catch((e) => e);
    const unknownEmail = await signIn("nobody@example.com", "whatever").catch((e) => e);
    expect(wrongPassword).toBeInstanceOf(HttpError);
    expect(wrongPassword.message).toBe(unknownEmail.message);
    expect(wrongPassword.status).toBe(401);
  });

  it("locks an email out after too many failed attempts, even from many IPs", async () => {
    const user = await makeUser();
    for (let i = 0; i < 8; i++) {
      resetRequest({ ip: `10.0.0.${i}` });
      await expect(signIn(user.email, "wrong-password")).rejects.toMatchObject({ status: 401 });
    }
    resetRequest({ ip: "10.0.1.1" });
    await expect(signIn(user.email, user.password)).rejects.toBeInstanceOf(RateLimitError);
  });
});

describe("updateProfile", () => {
  it("updates the name without a password", async () => {
    const user = await makeUser();
    const updated = await updateProfile(user.id, { firstName: "Anna Maria", lastName: "Smith", email: user.email });
    expect(updated.name).toBe("Anna Maria Smith");
  });

  it("requires the current password to change the email", async () => {
    const user = await makeUser();
    const base = { firstName: "A", lastName: "B", email: "new@example.com" };
    await expect(updateProfile(user.id, base)).rejects.toMatchObject({ status: 403 });
    await expect(updateProfile(user.id, { ...base, currentPassword: "wrong-password" })).rejects.toMatchObject({ status: 403 });
    expect((await updateProfile(user.id, { ...base, currentPassword: user.password })).email).toBe("new@example.com");
  });

  it("refuses an email that belongs to someone else", async () => {
    const other = await makeUser();
    const user = await makeUser();
    await expect(
      updateProfile(user.id, { firstName: "A", lastName: "B", email: other.email, currentPassword: user.password })
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("changePassword", () => {
  it("changes the password and signs out other sessions only", async () => {
    const user = await makeUser();
    const otherDevice = cookieJar.get(AUTH_COOKIE)!;

    resetRequest();
    await signIn(user.email, user.password);
    const current = (await getCurrentSession())!;

    await changePassword(user.id, current.sessionId, { currentPassword: user.password, newPassword: "brand-new-pass" });

    expect(await getSession()).not.toBeNull();
    cookieJar.set(AUTH_COOKIE, otherDevice);
    expect(await getSession()).toBeNull();

    resetRequest();
    await expect(signIn(user.email, user.password)).rejects.toMatchObject({ status: 401 });
    await signIn(user.email, "brand-new-pass");
  });

  it("rejects a wrong current password", async () => {
    const user = await makeUser();
    const { sessionId } = (await getCurrentSession())!;
    await expect(
      changePassword(user.id, sessionId, { currentPassword: "wrong-password", newPassword: "brand-new-pass" })
    ).rejects.toMatchObject({ status: 403 });
  });
});
