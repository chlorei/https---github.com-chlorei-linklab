"use server";

import { cookies } from "next/headers";
import { actionError, type ActionResult } from "./result";

export async function acceptAgreement(): Promise<ActionResult> {
  try {
    const store = await cookies();
    store.set("agreementAccepted", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return { ok: true };
  } catch (err) {
    return actionError(err, "Could not save your consent");
  }
}
