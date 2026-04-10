import userModel from "../models/userModel.js";
import { hashPassword } from "../helpers/authHelper.js";

export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { name, phone, address, password } = req.body;

    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (address) update.address = address;
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .send({ success: false, message: "Password must be at least 6 characters" });
      }
      update.password = await hashPassword(password);
    }

    const user = await userModel.findByIdAndUpdate(userId, update, {
      new: true,
      select: "-password",
    });

    return res.status(200).send({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.log("PROFILE UPDATE ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error updating profile", error });
  }
};

