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

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered, please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: 0,
    };

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

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

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

// CREATE ADMIN
export const createAdminController = async (req, res) => {
  try {
    const { email, token } = req.body;
    const setupToken = process.env.ADMIN_SETUP_TOKEN;

    if (!setupToken) {
      return res.status(500).send({
        success: false,
        message: "ADMIN_SETUP_TOKEN missing",
      });
    }

    if (!email || !token) {
      return res.status(400).send({
        success: false,
        message: "Email and token required",
      });
    }

    if (token !== setupToken) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.role = 1;
    await user.save();

    res.status(200).send({
      success: true,
      message: "User promoted to admin",
      user,
    });

  } catch (error) {
    console.log("ADMIN ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error creating admin",
      error,
    });
  }
};

// FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email not registered",
      });
    }

    const otp = generateOtp();
    user.passwordResetOtpHash = otpHash(otp);
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.status(200).send({
      success: true,
      message: "OTP generated",
      otp,
    });

  } catch (error) {
    console.log("FORGOT ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

// VERIFY OTP
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email not registered",
      });
    }

    if (otpHash(otp) !== user.passwordResetOtpHash) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    const resetToken = JWT.sign(
      { email, purpose: "pwdreset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).send({
      success: true,
      message: "OTP verified",
      resetToken,
    });

  } catch (error) {
    console.log("OTP ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error verifying OTP",
      error,
    });
  }
};

// RESET PASSWORD
export const resetPasswordController = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const decoded = JWT.verify(resetToken, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log("RESET ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error resetting password",
      error,
    });
  }
};