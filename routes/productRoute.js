import express from "express";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  listProductController,
  updateProductController,
} from "../controllers/productController.js";
import { uploadSingle } from "../utils/upload.js";

const router = express.Router();

router.get("/", listProductController);
router.get("/:id", getProductController);

router.post("/", requireAdmin, uploadSingle("photo"), createProductController);
router.put("/:id", requireAdmin, uploadSingle("photo"), updateProductController);
router.delete("/:id", requireAdmin, deleteProductController);

export default router;

