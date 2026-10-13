import { afterAll, beforeAll, beforeEach, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { cookiesApi, headersApi, resetRequest } from "./requestContext";

vi.mock("next/headers", () => ({
  cookies: async () => cookiesApi,
  headers: async () => headersApi,
}));

process.env.JWT_SECRET = "test-secret";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
});

beforeEach(async () => {
  resetRequest();
  if (mongoose.connection.readyState === 1) {
    await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  globalThis.__mongoose = undefined;
  await mongo?.stop();
});
