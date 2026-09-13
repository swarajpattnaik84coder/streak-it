import express from "express";
import { getStoreItems, buyStoreItem } from "../controllers/storeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/items", getStoreItems);
router.post("/buy", protect, buyStoreItem);

export default router;
