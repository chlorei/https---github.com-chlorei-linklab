
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type Session = { id: string; email: string, name: string} | null;

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET!;
    const { id, email, name } = jwt.verify(token, secret) as { id: string; email: string; name: string };
    return { id, email, name };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<{ id: string; email: string }> {
  const s = await getSession();
  if (!s) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return s;
}
