import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController,
  createAdminController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"; 

import { updateProfileController } from "../controllers/profileController.js";

const router = express.Router();

// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// TEST ROUTE
router.get("/test", requireSignIn, isAdmin, testController);

// USER AUTH CHECK
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROFILE UPDATE
router.put("/profile", requireSignIn, updateProfileController);

// ADMIN AUTH CHECK
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// CREATE ADMIN
router.post("/create-admin", createAdminController);

// PASSWORD RESET FLOW
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;