import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password as string, 10);
})

userSchema.methods.generateToken = async function () {
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email,
  }, process.env.JWT_SECRET as string)
}

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
}

export default mongoose.models.User || model("User", userSchema);
