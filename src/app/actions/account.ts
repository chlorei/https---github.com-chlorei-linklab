"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAuthCookie,
  destroySession,
  getCurrentSession,
  HttpError,
  refreshSessionCookie,
  revokeUserSessions,
} from "@/lib/auth/auth";
import { changePassword, updateProfile } from "@/lib/services/user.service";
import { actionError, type ActionResult } from "./result";

async function requireCurrentSession() {
  const current = await getCurrentSession();
  if (!current) throw new HttpError(401, "Your session has expired. Please sign in again.");
  return current;
}

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  try {
    const { user, sessionId } = await requireCurrentSession();
    const updated = await updateProfile(user.id, {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      currentPassword: formData.get("currentPassword") || undefined,
    });
    // name/email live in the JWT, so reissue it for the same session
    await refreshSessionCookie(updated, sessionId);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return actionError(err, "Failed to update profile");
  }
}

export async function changePasswordAction(formData: FormData): Promise<ActionResult> {
  try {
    const { user, sessionId } = await requireCurrentSession();
    await changePassword(user.id, sessionId, {
      currentPassword: formData.get("currentPassword") ?? "",
      newPassword: formData.get("newPassword") ?? "",
    });
    return { ok: true };
  } catch (err) {
    return actionError(err, "Failed to change password");
  }
}

export async function signOutOtherSessionsAction(): Promise<ActionResult<{ count: number }>> {
  try {
    const { user, sessionId } = await requireCurrentSession();
    return { ok: true, data: { count: await revokeUserSessions(user.id, sessionId) } };
  } catch (err) {
    return actionError(err, "Failed to sign out other sessions");
  }
}

/**
 * Form action, so it can't return an ActionResult. Logging out must always work for
 * the user: if revoking the server-side session fails, the cookie is still cleared.
 */
export async function logoutAction(): Promise<void> {
  try {
    await destroySession();
  } catch (err) {
    console.error("Failed to revoke session on logout:", err);
    await clearAuthCookie();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
