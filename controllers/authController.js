export * from "../authController.js";

import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const otpHash = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // validation
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered, please login",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // save user
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: 0,
    };

    // If client sends role=1, directly mark as admin (DEV DEMO ONLY)
    if (Number(role) === 1) {
      userData.role = 1;
    }

    const user = await new userModel(userData).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.log("REGISTER ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // token
    const token = JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.log("LOGIN ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// TEST
export const testController = (req, res) => {
  res.send("Protected Routes");
};

// ONE-TIME: CREATE / UPGRADE ADMIN USER (by email + setup token)
export const createAdminController = async (req, res) => {
  try {
    const { email, token } = req.body;
    const setupToken = process.env.ADMIN_SETUP_TOKEN;

    if (!setupToken) {
      return res.status(500).send({
        success: false,
        message: "ADMIN_SETUP_TOKEN missing in backend .env",
      });
    }

    if (!email || !token) {
      return res.status(400).send({
        success: false,
        message: "Email and token are required",
      });
    }

    if (token !== setupToken) {
      return res.status(401).send({
        success: false,
        message: "Invalid setup token",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User with this email not found",
      });
    }

    user.role = 1;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "User promoted to admin",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("CREATE ADMIN ERROR 👉", error);
    return res.status(500).send({
      success: false,
      message: "Error creating admin",
      error,
    });
  }
};

// FORGOT PASSWORD (DEMO: returns OTP in response)
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered. Please register first.",
      });
    }

    const otp = generateOtp();
    user.passwordResetOtpHash = otpHash(otp);
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    return res.status(200).send({
      success: true,
      message: "OTP generated (demo)",
      otp, // demo requirement: show OTP on screen
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR 👉", error);
    return res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

// VERIFY OTP -> returns short-lived resetToken
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .send({ success: false, message: "Email and OTP are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered. Please register first.",
      });
    }

    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpires) {
      return res
        .status(400)
        .send({ success: false, message: "OTP not requested" });
    }

    if (user.passwordResetOtpExpires.getTime() < Date.now()) {
      return res.status(400).send({ success: false, message: "OTP expired" });
    }

    if (otpHash(otp) !== user.passwordResetOtpHash) {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }

    const resetToken = JWT.sign(
      { email, purpose: "pwdreset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).send({
      success: true,
      message: "OTP verified",
      resetToken,
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR 👉", error);
    return res.status(500).send({
      success: false,
      message: "Error in OTP verification",
      error,
    });
  }
};

// RESET PASSWORD using resetToken
export const resetPasswordController = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);
    if (decoded?.purpose !== "pwdreset" || !decoded?.email) {
      return res.status(401).send({ success: false, message: "Invalid token" });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.passwordResetOtpHash = "";
    user.passwordResetOtpExpires = undefined;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("RESET PASSWORD ERROR 👉", error);
    return res.status(500).send({
      success: false,
      message: "Error in reset password",
      error,
    });
  }
};