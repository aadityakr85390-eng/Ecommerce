import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      console.error("MongoDB Error: MONGO_URL is not set in .env file");
      process.exit(1);
    }

    const conn = await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    if (error.message.includes("authentication failed")) {
      console.error("→ Check username/password in .env (MONGO_URL)");
    }
    if (error.message.includes("ENOTFOUND") || error.message.includes("timed out")) {
      console.error("→ Check internet connection and Atlas IP whitelist (allow 0.0.0.0/0 for dev)");
    }
    process.exit(1);
  }
};

export default connectDB;