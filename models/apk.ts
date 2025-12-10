import mongoose, { Schema, model } from "mongoose";

const apkSchema = new Schema({
  name: String,
  image: String,
  packageName: String,
  publisher: String,
  category: String,
  size: String,
  rating: Number,
  version: String,
  platform: String,
  price: String,
  description: String,
  downloadUrl: String,
  requirements: String,
  modInfo: String,
  screenshots: [String],
  tags: [String],
}, {timestamps: true})

export default mongoose.models.Apk || model("Apk", apkSchema);
