import { Schema, model, models, Types } from "mongoose";

const visitSchema = new Schema(
  {
    linkId: { type: Types.ObjectId, ref: "Link", required: true, index: true },
    ts: { type: Date, default: Date.now, index: true },
    ip: String,
    userAgent: String,
    creatorUserId: { type: Types.ObjectId, ref: "User", required: false, default: "undefined" },
  },
  { timestamps: true }
);

visitSchema.index({ linkId: 1, ts: -1 });
visitSchema.index({ creatorUserId: 1, createdAt: -1 });

export default models.Visit || model("Visit", visitSchema);