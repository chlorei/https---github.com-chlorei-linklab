import { Schema, model, models, Types } from "mongoose";

export interface ProjectDoc {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  color?: string; // hex
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true},
    title: { type: String, required: true, trim: true },
    description: { type: String },
    color: { type: String, default: "#4F7BFF" },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.index({ userId: 1, title: 1 });

export const Project = models.Project || model<ProjectDoc>("Project", ProjectSchema);