import express from "express";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { requireSignIn } from "../middleware/authMiddlerware.js";
import {
  adminOrderStatsController,
  createOrderController,
  createRazorpayOrderController,
  listAdminOrdersController,
  myOrdersController,
  updateAdminOrderStatusController,
  verifyRazorpayPaymentController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", requireSignIn, createOrderController);
router.post("/razorpay/create-order", requireSignIn, createRazorpayOrderController);
router.post("/razorpay/verify", requireSignIn, verifyRazorpayPaymentController);
router.get("/my-orders", requireSignIn, myOrdersController);
router.get("/admin/stats", requireAdmin, adminOrderStatsController);
router.get("/admin/orders", requireAdmin, listAdminOrdersController);
router.put("/admin/orders/:id/status", requireAdmin, updateAdminOrderStatusController);

export default router;
