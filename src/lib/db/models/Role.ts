import  { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    value: {type: String, unique: true, default: "USER"}
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;