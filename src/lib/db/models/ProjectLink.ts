// lib/db/models/ProjectLink.ts
import { Schema, model, models, Types } from "mongoose";

export interface ProjectLinkDoc {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  linkId: Types.ObjectId;
  pinned: boolean;
  order: number;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectLinkSchema = new Schema<ProjectLinkDoc>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true, index: true },
    pinned: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProjectLinkSchema.index({ projectId: 1, linkId: 1 }, { unique: true });
ProjectLinkSchema.index({ projectId: 1, order: 1 });

export const ProjectLink = models.ProjectLink || model<ProjectLinkDoc>("ProjectLink", ProjectLinkSchema);