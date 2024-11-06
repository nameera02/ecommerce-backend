import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);