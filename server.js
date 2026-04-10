import express from "express";
import "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import dns from "dns";
import cors from "cors";

// DNS fix
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// env config
dotenv.config({ path: join(__dirname, ".env") });

// DB connect
connectDB();

const app = express();

// ✅ FIXED CORS
app.use(
  cors({
    // Allow CRA dev server from localhost OR LAN IP (fixes browser "Network Error")
    origin: true,
    credentials: false,
  })
);

// middleware
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

// static uploads (product images)
app.use("/uploads", express.static(join(__dirname, "uploads")));

// test route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// port
const PORT = process.env.PORT || 8080;

// run server
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`
      .bgCyan.white
  );
});