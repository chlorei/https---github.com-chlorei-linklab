import { Schema, model, models, Types } from 'mongoose';

const linkSchema = new Schema(
  {
    // userId: { type: Types.ObjectId, ref: 'User', index: true },
    shortId: { type: String, unique: true, index: true, required: true },
    originalUrl: { type: String, required: true },
    domain: { type: String, default: null, index: true }, // custom domain support
    title: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

linkSchema.index({ userId: 1, createdAt: -1 });
linkSchema.index({ domain: 1, shortId: 1 }, { unique: true, sparse: true });

export type LinkDoc = typeof linkSchema extends infer T ? T : never;
export default models.Link || model('Link', linkSchema);