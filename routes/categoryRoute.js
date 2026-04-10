import express from "express";
import { createCategoryController, listCategoryController } from "../controllers/categoryController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", listCategoryController);
router.post("/", requireAdmin, createCategoryController);

export default router;

