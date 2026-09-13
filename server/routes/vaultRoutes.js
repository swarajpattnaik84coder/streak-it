import express from "express";
import { getVaultData } from "../controllers/vaultController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getVaultData);

export default router;
