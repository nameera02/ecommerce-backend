import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);