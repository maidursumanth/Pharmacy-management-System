import Medicine from "../models/MedicineSchema.js";
import mongoose from "mongoose";
import ActivityLog from "../models/ActivityLog.js";

export const addMedicine = async (req, res) => {
  try {

    // BULK INSERT
    if (Array.isArray(req.body)) {

      const medicines = await Medicine.insertMany(req.body);

      for (const medicine of medicines) {

        await ActivityLog.create({
          action: "CREATE",
          medicineId: medicine._id,
          medicineName: medicine.name,
          performedBy: req.user.id,
          details: "Created new medicine"
        });
      }
      return res.status(201).json(medicines);

    }

    // SINGLE INSERT
    const medicine = await Medicine.create(req.body);

    await ActivityLog.create({
      action: "CREATE",
      medicineId: medicine._id,
      medicineName: medicine.name,
      performedBy: req.user.id,
      details: "Created new medicine"
    });

    res.status(201).json(medicine);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const GetSingleMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid medicine ID" });
    }

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(medicine);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    delete req.body.quantity;

    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body,
        {
          returnDocument: "after"
        }
      );

      await ActivityLog.create({
      action: "UPDATE",
      medicineId: updated._id,
      medicineName: updated.name,
      performedBy: req.user.id,
      details: "Updated medicine details"

    });

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

export const deleteMedicine = async (req, res) => {
  try {

    const medicine =
      await Medicine.findById(
        req.params.id
      );

    if (!medicine) {

      return res.status(404).json({
        error: "Medicine not found"
      });

    }

    await ActivityLog.create({
      action: "DELETE",
      medicineId: medicine._id,
      medicineName: medicine.name,
      performedBy: req.user.id,
      details: "Deleted medicine"
    });

    await Medicine.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Medicine deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getLowStock = async (req, res) => {
  try {
    const medicines = await Medicine.find({ quantity: { $gte:1, $lt: 10 } });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpiringSoon = async (req, res) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const medicines = await Medicine.find({
      expiryDate: { $gte: today, $lte: next30Days }
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpired = async (req, res) => {

  try {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const medicines = await Medicine.find({
      expiryDate: { $lt: today }
    }).sort({ expiryDate: 1 });

    res.status(200).json(medicines);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

export const OutOfStock = async (req, res) => {
  try {
    const medicines = await Medicine.find({ quantity: { $eq: 0 } });
    if(medicines.length===0){
        return res.status(200).json({message:"All Products are in stock"})
    }
    return res.status(200).json(medicines)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivities =async (req, res) => {
    try {
      const logs =await ActivityLog.find()
          .populate(
            "performedBy",
            "name"
          )
          .sort({createdAt: -1});
      res.json(logs);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
};