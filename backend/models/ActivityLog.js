import mongoose from "mongoose";

const ActivityLogSchema =
  new mongoose.Schema({

    action: {
      type: String,
      required: true
    },

    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine"
    },

    medicineName: {
      type: String
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    details: {
      type: String
    }

  }, {
    timestamps: true
  });

export default mongoose.model(
  "ActivityLog",
  ActivityLogSchema
);