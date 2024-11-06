import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  authorize: { type: Boolean, required: true }, // Field to check authorization
  sr_no: { type: Number, required: true, unique: true }, // Unique serial number
});

export default mongoose.model("Brand", brandSchema);
