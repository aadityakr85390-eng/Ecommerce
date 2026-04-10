import bcrypt from "bcrypt";

// hash password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log("HASH ERROR 👉", error);
  }
};

// compare password
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log("COMPARE ERROR 👉", error);
  }
};