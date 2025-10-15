import { Schema, model, models } from 'mongoose';

const linkSchema = new Schema(
  {
    shortId: { type: String, unique: true, index: true, required: true },
    originalUrl: { type: String, required: true },
    domain: { type: String, default: null, index: true },
    title: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" }, 
    anonId: { type: String },     
  },
  { timestamps: true }
);

linkSchema.index({ userId: 1, createdAt: -1 });
linkSchema.index({ domain: 1, shortId: 1 }, { unique: true, sparse: true });

export type LinkDoc = typeof linkSchema extends infer T ? T : never;
export default models.Link || model('Link', linkSchema);