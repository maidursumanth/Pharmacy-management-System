import express from "express";
import {
  addMedicine,
  GetSingleMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  getLowStock,
  getExpiringSoon,
  getExpired,
  OutOfStock,
  getActivities
} from "../controllers/MedicineControllers.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", protect, isAdmin, addMedicine);
router.put("/:id", protect, isAdmin, updateMedicine);
router.delete("/:id", protect, isAdmin, deleteMedicine);

router.get("/outofstock", protect, OutOfStock);
router.get("/low-stock", protect, getLowStock);
router.get("/expiring-soon", protect, getExpiringSoon);
router.get("/expired", protect, getExpired);

router.get("/activity", protect, getActivities);


// All logged users
router.get("/", protect, getMedicines);
router.get("/:id", protect, GetSingleMedicine);

export default router;