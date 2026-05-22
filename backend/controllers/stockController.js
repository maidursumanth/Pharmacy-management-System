import Medicine from "../models/MedicineSchema.js";
import StockLog from "../models/StockLogs.js";
import mongoose from "mongoose";
import ActivityLog from "../models/ActivityLog.js";

export const getStockHistory = async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate("medicineId", "name")
      .populate("updatedBy", "name")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    let { quantity, type } = req.body;
    // VALIDATE ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid medicine ID"
      });
    }
    // VALIDATE QUANTITY
    quantity = Number(quantity);
    if (
      !quantity ||
      quantity <= 0
    ) {
      return res.status(400).json({
        error: "Quantity must be greater than 0"
      });

    }
    // FIND MEDICINE
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({
        error: "Medicine not found"
      });
    }
    let newQuantity = medicine.quantity;

    // ADD STOCK
    if (type === "ADD") {
      newQuantity += quantity;
    }

    // REMOVE STOCK
    else if (type === "REMOVE") {
      if (
        medicine.quantity < quantity
      ) {
        return res.status(400).json({
          error: "Insufficient stock"
        });

      }
      newQuantity -= quantity;
    }

    // INVALID TYPE
    else {
      return res.status(400).json({
        error:
          "Invalid type (ADD or REMOVE only)"
      });
    }

    // SAVE
    medicine.quantity = newQuantity;
    await medicine.save();

    // STOCK LOG
    await StockLog.create({
      medicineId: id,
      change: quantity,
      type,
      updatedBy: req.user.id
    });

    await ActivityLog.create({
    action: type,
    medicineId: medicine._id,
    medicineName: medicine.name,
    performedBy: req.user.id,
    details: `${type} ${quantity} units`
  });

    res.status(200).json({
      message: "Stock updated successfully",
      quantity: medicine.quantity
    });

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

