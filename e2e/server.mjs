// Starts a throwaway in-memory MongoDB and a Next.js server against it, for Playwright.
import { spawn } from "node:child_process";
import { MongoMemoryServer } from "mongodb-memory-server";

const port = process.env.E2E_PORT ?? "3210";
const mongo = await MongoMemoryServer.create();

const mode = process.env.E2E_NEXT_MODE === "start" ? ["start"] : ["dev", "--turbopack"];
const next = spawn("npx", ["next", ...mode, "-p", port], {
  stdio: "inherit",
  env: {
    ...process.env,
    MONGO_URI: mongo.getUri(),
    MONGODB_DB: "relinxr-e2e",
    JWT_SECRET: "e2e-secret",
    IPINFO_API_TOKEN: "",
  },
});

async function shutdown() {
  next.kill("SIGTERM");
  await mongo.stop();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
next.on("exit", async (code) => {
  await mongo.stop();
  process.exit(code ?? 0);
});
