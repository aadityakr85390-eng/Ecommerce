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
import { isAdmin, requireSignIn } from "../middlewares/authMidderware.js";
import { updateProfileController } from "../controllers/profileController.js";

const router = express.Router();

// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//Test Route
router.get('/test', requireSignIn,isAdmin,testController);

// Protected Route Auth
router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ok:true});
});

// Profile update
router.put("/profile", requireSignIn, updateProfileController);

// Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// One-time admin creation (secured by ADMIN_SETUP_TOKEN, body: { email, token })
router.post("/create-admin", createAdminController);

// Forgot password (demo OTP flow)
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router; 