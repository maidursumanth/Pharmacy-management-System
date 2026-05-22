import Sale from "../models/SalesSchema.js";
import Medicine from "../models/MedicineSchema.js";
import StockLog from "../models/StockLogs.js";
import ActivityLog from "../models/ActivityLog.js";

export const createSale = async (req, res) => {

  try {

    const {
  items,
  totalAmount,
  customerName
} = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items selected"
      });
    }

    // CHECK STOCK
    for (const item of items) {

      const medicine =
        await Medicine.findById(
          item.medicineId
        );

      if (!medicine) {
        return res.status(404).json({
          message:
            `${item.medicineName} not found`
        });
      }

      if (
        medicine.quantity < item.quantity
      ) {
        return res.status(400).json({
          message:
            `Not enough stock for ${medicine.name}`
        });
      }
    }

    // REDUCE STOCK + LOG
    for (const item of items) {

      const medicine =
        await Medicine.findById(
          item.medicineId
        );

      medicine.quantity -= item.quantity;

      await medicine.save();

      await StockLog.create({
        medicineId: medicine._id,
        change: item.quantity,
        type: "REMOVE",
        updatedBy: req.user.id,
        changedBy: req.user.id
      });
    }

    // CREATE SALE
    const sale = await Sale.create({

      items,

      totalAmount,

      soldBy: req.user.id,

      billNumber:
        `BILL-${Date.now()}`

    });

    for (const item of items) {

  await ActivityLog.create({

    medicineName: item.medicineName,

    action: "SALE",

    details:
      `Sold ${item.quantity} units to ${customerName} | Bill No: ${sale.billNumber}`,

    performedBy: req.user.id

  });

}

    res.status(201).json({
      message: "Bill generated",
      sale
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};