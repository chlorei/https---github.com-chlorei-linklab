// app/actions/account.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/auth";
import * as AuthController from "@/lib/controllers/auth.controller";
import jwt from "jsonwebtoken";

function signJwt(payload: { id: string; email: string; name: string }) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: "70h" });
}

export async function updateProfileAction(formData: FormData) {
  const { id: userId, email: oldEmail } = await requireSession();
  const oldName = "";
  const firstName = (formData.get("firstName") as string | null)?.trim() || "";
  const lastName  = (formData.get("lastName")  as string | null)?.trim() || "";
  const email     = (formData.get("email")     as string | null)?.trim().toLowerCase() || "";

  if (!email) throw new Error("Email is required");

  try {
    interface User {
      _id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    }

    const result = await AuthController.updateProfile(userId, { firstName, lastName, email });
    const updated: User | null = Array.isArray(result) ? (result[0] as User | null) : (result as User | null);
    if (!updated) throw new Error("User not found");

    const newName = `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim() || oldName || "";
    const nameChanged  = newName !== (oldName || "");
    const emailChanged = (updated.email ?? oldEmail) !== oldEmail;

    if (nameChanged || emailChanged) {
      const token = signJwt({ id: String(updated._id), email: updated.email ?? oldEmail, name: newName });
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 70 * 60 * 60,
      });
    }

    revalidatePath("/account");
    revalidatePath("/dashboard");
    revalidatePath("/"); 

  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      (typeof e === "object" && e !== null && "code" in e ? (e as { code?: number }).code === 11000 : false) ||
      (typeof e === "object" && e !== null && "message" in e ? /duplicate key/i.test(String((e as { message?: string }).message)) : false)
    ) {
      throw new Error("Email is already taken");
    }
    throw new Error(
      typeof e === "object" && e !== null && "message" in e
        ? String((e as { message?: string }).message)
        : "Failed to update profile"
    );
  }
}




export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { path: "/", maxAge: 0 });
}