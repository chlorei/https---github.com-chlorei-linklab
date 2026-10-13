import { Schema, model, models } from "mongoose";

// A server-side record per issued JWT (keyed by its jti). Deleting it revokes the token.
const SessionSchema = new Schema(
  {
    _id: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true, versionKey: false }
);

export default models.Session || model("Session", SessionSchema);
