import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["ADD", "REMOVE"],
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  changedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
}, { timestamps: true });

export default mongoose.model("StockLog", stockLogSchema);