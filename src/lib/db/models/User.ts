// models/User.ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, index: true },
  password:  { type: String, required: true },
}, { timestamps: true });

export default models.User || model("User", UserSchema);