import express from "express";
import {createSale} from "../controllers/SalesController.js";
import {protect} from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/create",protect,isAdmin,createSale);

export default router;