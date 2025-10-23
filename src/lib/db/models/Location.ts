import { Schema, model, models } from "mongoose";


const LocationSchema = new Schema({
  countryName: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ip: String
}, { timestamps: true, strict: false });


LocationSchema.index({ userId: 1, createdAt: -1 });


export default models.Location || model("Location", LocationSchema);