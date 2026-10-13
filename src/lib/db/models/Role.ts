import { Schema, models, model } from "mongoose";

const RoleSchema = new Schema(
  {
    value: { type: String, unique: true, default: "USER" },
  },
  { timestamps: true }
);

export default models.Role || model("Role", RoleSchema);
