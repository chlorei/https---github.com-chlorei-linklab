import { Schema, model, models } from "mongoose";

const LinkSchema = new Schema({
  shortId:     { type: String, required: true, unique: true, index: true },
  originalUrl: { type: String, required: true },
  domain:      { type: String, default: null, index: true },
  title:       { type: String, default: null },
  isActive:    { type: Boolean, default: true },
  userId:      { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

LinkSchema.index({ userId: 1, createdAt: -1 });
LinkSchema.index({ anonId: 1, createdAt: -1 });
LinkSchema.index({ domain: 1, shortId: 1 }, { unique: true, sparse: true });

export default models.Link || model("Link", LinkSchema);