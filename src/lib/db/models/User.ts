import { Schema, model, models, Types } from "mongoose";

const userSchema = new Schema(
  {
    linkId: { type: Types.ObjectId, ref: "Link", required: true, index: true },
    ts: { type: Date, default: Date.now, index: true },
    ip: String,
    userAgent: String,
  },
  { timestamps: false }
);

userSchema.index({ linkId: 1, ts: -1 });

export default models.User || model("User", userSchema);