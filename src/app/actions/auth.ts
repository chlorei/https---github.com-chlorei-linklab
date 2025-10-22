// app/actions/auth.ts
"use server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as AuthController from "@/lib/controllers/auth.controller";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const generateAccessToken = (user: { id: string; email: string; name: string }) => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(user, secret, { expiresIn: "70h" });
};

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string) ?? "";

  if (!email || !password) throw new Error("Missing credentials");

  const userResult = await AuthController.findOneByEmail(email);
  const user = Array.isArray(userResult) ? userResult[0] : userResult;
  if (!user) throw new Error("User not found");

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = generateAccessToken({
    id: String(user._id),
    email: user.email,
    name: user.name ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 70 * 60 * 60,
  });

  redirect("/dashboard");
}