import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  sr_no: { type: Number, required: true, unique: true }, // Ensure unique serial numbers
  imagePath: { type: String, required: true }, // Path to the image file
  name: { type: String, required: true } // Path to the image file
});

export default mongoose.model("Certificate", certificateSchema);