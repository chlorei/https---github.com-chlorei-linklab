import { registerUser } from "@/lib/services/user.service";
import { resetRequest } from "./requestContext";

let n = 0;

/** Registers a fresh user from a distinct IP (so register rate limits don't interfere). */
export async function makeUser(password = "password123") {
  n += 1;
  resetRequest({ ip: `198.51.100.${n}` });
  const user = await registerUser({ firstName: "Test", lastName: `User${n}`, email: `user${n}@example.com`, password });
  return { ...user, password };
}
