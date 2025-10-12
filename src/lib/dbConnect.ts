import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env.local");

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
    if (process.env.NODE_ENV !== "production") mongoose.set("debug", true); // временно включим логи
    cached.promise = mongoose.connect(MONGO_URI!, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      dbName: process.env.MONGODB_DB || undefined,
    })
    .then((m) => {
      console.log("✅ Mongoose connected");
      return m;
    })
    .catch((err) => {
      console.error("❌ Mongoose connect error:", err?.message || err);
      throw err;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose runtime error:", err?.message || err);
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}