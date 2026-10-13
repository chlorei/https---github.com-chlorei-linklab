import { Schema, model, models } from "mongoose";

const LinkSchema = new Schema(
  {
    shortId:     { type: String, required: true, unique: true },
    projectId:   { type: Schema.Types.ObjectId, ref: "Project", default: null },
    originalUrl: { type: String, required: true },
    domain:      { type: String, default: null, index: true },
    title:       { type: String, default: null },
    isActive:    { type: Boolean, default: true },
    userId:      { type: Schema.Types.ObjectId, ref: "User", default: null },
    // sha256 of the creator's anon_id cookie, for links made while signed out
    anonKey:     { type: String, default: null },
    clicks:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

LinkSchema.index({ userId: 1, createdAt: -1 });
LinkSchema.index({ projectId: 1, createdAt: -1 });
LinkSchema.index({ anonKey: 1, createdAt: -1 }, { partialFilterExpression: { anonKey: { $type: "string" } } });

export default models.Link || model("Link", LinkSchema);
