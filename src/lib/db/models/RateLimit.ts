import { Schema, model, models } from "mongoose";

// One document per (bucket, key, window). Mongo's TTL monitor removes expired ones.
const RateLimitSchema = new Schema(
  {
    _id: { type: String },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { versionKey: false }
);

export default models.RateLimit || model("RateLimit", RateLimitSchema);
