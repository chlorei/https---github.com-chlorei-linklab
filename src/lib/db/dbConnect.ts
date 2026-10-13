import mongoose from "mongoose";

declare global {
  var __mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached = global.__mongoose ?? { conn: null, promise: null };
global.__mongoose = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined");

    if (process.env.MONGOOSE_DEBUG === "true") mongoose.set("debug", true);

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
        dbName: process.env.MONGODB_DB || undefined,
      })
      .catch((err) => {
        // allow a retry on the next call instead of caching the failure
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
