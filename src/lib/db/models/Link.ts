import mongoose, { Schema, model, models} from "mongoose";

const LinkSchema = new Schema(
  {
    shortId:     { type: String, required: true, unique: true, index: true },
    projectId:   { type: Schema.Types.ObjectId, ref: "Project", required: false, default: null }, // <-- не обязательное
    originalUrl: { type: String, required: true },
    domain:      { type: String, default: null, index: true },
    title:       { type: String, default: null },
    isActive:    { type: Boolean, default: true },
    userId:      { type: Schema.Types.ObjectId, ref: "User", default: null },
    clicks:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

LinkSchema.index({ userId: 1, createdAt: -1 });
LinkSchema.index({ domain: 1, shortId: 1 }, { unique: true, sparse: true });

// 🔧 ключевая строка: убиваем старую модель, чтобы применился новый schema
// if (mongoose.models.Link) {
//   mongoose.deleteModel("Link"); // доступно в Mongoose v7+
/// }
export default models.Link || model("Link", LinkSchema);