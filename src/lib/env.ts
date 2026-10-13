/** Env vars the app can't work without (see .env.example). */
export const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"] as const;

export function missingEnv(): string[] {
  return REQUIRED_ENV.filter((name) => !process.env[name]);
}
