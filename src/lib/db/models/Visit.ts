import { Schema, model, models } from "mongoose";

const visitSchema = new Schema(
  {
    linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true, index: true },
    ts: { type: Date, default: Date.now, index: true },
    ip: String,
    userAgent: String,
    creatorUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    // null for visits recorded before countries were stored per visit (see scripts/backfill-visit-countries.ts)
    countryName: { type: String, default: null },
  },
  { timestamps: true }
);

visitSchema.index({ linkId: 1, ts: -1 });
visitSchema.index({ creatorUserId: 1, createdAt: -1 });
visitSchema.index({ creatorUserId: 1, countryName: 1 });
visitSchema.index({ projectId: 1, createdAt: -1 });

export default models.Visit || model("Visit", visitSchema);
