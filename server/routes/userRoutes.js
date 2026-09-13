import express from "express";
import { allocateStatPoint, updateEquipped } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/allocate-stat", allocateStatPoint);
router.post("/equip", updateEquipped);

export default router;
