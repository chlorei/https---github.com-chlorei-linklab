"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/services/user.service";
import { safeNextPath } from "@/app/utils/safeNextPath";
import { actionError, type ActionResult } from "./result";

export async function loginAction(formData: FormData): Promise<ActionResult> {
  try {
    await signIn(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  } catch (err) {
    return actionError(err, "Login failed");
  }
  // outside try: redirect() works by throwing
  redirect(safeNextPath(formData.get("next")));
}
