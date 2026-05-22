import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({

  items: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
      },

      medicineName: {
        type: String,
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      subtotal: {
        type: Number,
        required: true
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  billNumber: {
    type: String,
    unique: true
  }

}, { timestamps: true });

export default mongoose.model(
  "Sale",
  salesSchema
);