import "server-only";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/dbConnect";
import User from "@/lib/db/models/User";
import { createSession, HttpError, revokeUserSessions, type SessionUser } from "@/lib/auth/auth";
import { getClientIp, rateLimit, RULES } from "@/lib/rateLimit";
import { clearAnonCookie, getAnonKey } from "@/lib/auth/anonymous";
import { claimAnonymousLinks } from "@/lib/services/link.service";
import { passwordChangeSchema, profileSchema, registerSchema } from "@/lib/validation";

const BCRYPT_ROUNDS = 12;
// Compared against when the email is unknown, so both paths take the same time.
const DUMMY_HASH = "$2b$12$mFv/Bo9e6wZ.3XQg4EVpX.tbPnuiEI3DC.z1dj.AFiiuh4GxaygwW";

type UserDoc = { _id: unknown; firstName?: string; lastName?: string; email: string; password?: string };

function toSessionUser(u: UserDoc): SessionUser {
  return {
    id: String(u._id),
    email: u.email,
    name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
  };
}

/** Starts a session and adopts any links this browser created while signed out. */
async function startSession(user: SessionUser) {
  await createSession(user);
  const anonKey = await getAnonKey();
  if (anonKey) {
    await claimAnonymousLinks(user.id, anonKey);
    await clearAnonCookie();
  }
}

async function verifyPassword(userId: string, password: string) {
  const user = await User.findById(userId).select("+password").lean<UserDoc>();
  if (!user) throw new HttpError(404, "User not found");
  if (!password || !(await bcrypt.compare(password, user.password ?? DUMMY_HASH))) {
    throw new HttpError(403, "Current password is incorrect");
  }
  return user;
}

/** Creates the account and signs the user in. */
export async function registerUser(input: unknown): Promise<SessionUser> {
  await rateLimit("register", await getClientIp(), RULES.register);
  const data = registerSchema.parse(input);
  await dbConnect();

  if (await User.exists({ email: data.email })) {
    throw new HttpError(409, "User with this email already exists");
  }

  const password = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const user = toSessionUser(await User.create({ ...data, password }));
  await startSession(user);
  return user;
}

/** Returns the user on valid credentials, null otherwise (never reveals which part was wrong). */
export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;

  await dbConnect();
  const user = await User.findOne({ email: normalized }).select("+password").lean<UserDoc>();
  const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  return user && valid ? toSessionUser(user) : null;
}

/** Rate-limited login that starts a session on success. */
export async function signIn(email: string, password: string): Promise<SessionUser> {
  // per-IP stops spraying many accounts, per-email stops a distributed attack on one account
  await rateLimit("login-ip", await getClientIp(), RULES.loginByIp);
  await rateLimit("login-email", email.trim().toLowerCase() || "-", RULES.loginByEmail);

  const user = await authenticate(email, password);
  if (!user) throw new HttpError(401, "Invalid email or password");
  await startSession(user);
  return user;
}

/** Updates name/email. Changing the email requires the current password. */
export async function updateProfile(userId: string, input: unknown): Promise<SessionUser> {
  const { currentPassword, ...data } = profileSchema.parse(input);
  await dbConnect();

  const current = await User.findById(userId).lean<UserDoc>();
  if (!current) throw new HttpError(404, "User not found");

  if (data.email !== current.email) {
    await rateLimit("password-check", userId, RULES.passwordChange);
    await verifyPassword(userId, currentPassword ?? "");
    if (await User.exists({ email: data.email, _id: { $ne: userId } })) {
      throw new HttpError(409, "Email is already taken");
    }
  }

  const updated = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true }).lean<UserDoc>();
  if (!updated) throw new HttpError(404, "User not found");
  return toSessionUser(updated);
}

/** Changes the password and signs out every other session. */
export async function changePassword(userId: string, currentSessionId: string, input: unknown) {
  await rateLimit("password-check", userId, RULES.passwordChange);
  const { currentPassword, newPassword } = passwordChangeSchema.parse(input);
  await dbConnect();

  await verifyPassword(userId, currentPassword);
  const password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await User.updateOne({ _id: userId }, { $set: { password } });
  await revokeUserSessions(userId, currentSessionId);
}

export type Profile = { firstName: string; lastName: string; email: string };

/** Editable profile fields for the account page, or null if the user no longer exists. */
export async function getProfile(userId: string): Promise<Profile | null> {
  await dbConnect();
  const u = await User.findById(userId).lean<UserDoc>();
  return u ? { firstName: u.firstName ?? "", lastName: u.lastName ?? "", email: u.email } : null;
}
