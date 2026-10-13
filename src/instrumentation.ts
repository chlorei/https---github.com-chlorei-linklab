import { missingEnv } from "@/lib/env";

/** Runs once when the server starts: fail loudly on a missing config instead of 500s later. */
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const missing = missingEnv();
  if (missing.length === 0) return;

  console.error(
    `\n❌ Missing required environment variables: ${missing.join(", ")}\n` +
      `   Copy .env.example to .env.local, fill it in, and restart the server.\n` +
      `   Until then, sign-up, sign-in and links will fail with "Internal error".\n`
  );
}
