"use server";

import { cookies } from "next/headers";

export async function acceptAgreement() {
  const store = await cookies();

  store.set("agreementAccepted", "true", {
    httpOnly: false, // ⚠️ ставим false, чтобы можно было увидеть в браузере (в dev)
    secure: false,   // ⚠️ в dev без HTTPS нельзя ставить true
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 год
  });

  console.log("✅ Cookie set on server!");
}