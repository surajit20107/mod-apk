import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: String,
  name: String,
  email: String,
  phone: String,
  password: String,
  image: String,
  role: {
    type: String,
    default: "user",
  },
}, { timestamps: true })

export default mongoose.models.User || model("User", userSchema);
