import { Schema, model, models } from "mongoose";

const LocationSchema = new Schema({
  countryName:     { type: String, default: "XX", required: true },
  clicks:      { type: Number, default: 0 },                    

}, { timestamps: true });


LocationSchema.index({ ipAddress: 1 }, { unique: true });
LocationSchema.index({ userId: 1, createdAt: -1 });
LocationSchema.index({ domain: 1, shortId: 1 }, { unique: true, sparse: true });


export default models.Location || model("Location", LocationSchema);