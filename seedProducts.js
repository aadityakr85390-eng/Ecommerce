import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import "./config/db.js";
import categoryModel from "./models/categoryModel.js";
import productModel from "./models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const run = async () => {
  try {
    // Ensure DB connection is established
    if (mongoose.connection.readyState === 0) {
      const MONGO_URL = process.env.MONGO_URL;
      await mongoose.connect(MONGO_URL);
    }

    const baseCategories = ["Fashion", "Electronics", "Footwear", "Accessories", "Home"];
    const existingCats = await categoryModel.find({});
    const byName = new Map(existingCats.map((c) => [c.name, c]));

    const ensureCategory = async (name) => {
      if (byName.has(name)) return byName.get(name);
      const created = await categoryModel.create({ name });
      byName.set(name, created);
      return created;
    };

    const catDocs = {};
    for (const name of baseCategories) {
      catDocs[name] = await ensureCategory(name);
    }

    const products = [
      {
        name: "Minimal Black T‑Shirt",
        description: "Heavy cotton oversized tee in jet black.",
        price: 799,
        category: "Fashion",
      },
      {
        name: "Everyday Blue Denim",
        description: "Straight fit denim, mid-rise, stretch fabric.",
        price: 1599,
        category: "Fashion",
      },
      {
        name: "Classic White Sneakers",
        description: "Low-cut sneakers with cushioned sole.",
        price: 2499,
        category: "Footwear",
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes for daily jogs.",
        price: 2799,
        category: "Footwear",
      },
      {
        name: "Wireless Earbuds",
        description: "In-ear Bluetooth earbuds with charging case.",
        price: 1999,
        category: "Electronics",
      },
      {
        name: "Over‑Ear Headphones",
        description: "Soft cushioned pads with deep bass.",
        price: 3499,
        category: "Electronics",
      },
      {
        name: "Smart Watch Lite",
        description: "Tracks steps, heart rate and notifications.",
        price: 2999,
        category: "Electronics",
      },
      {
        name: "Leather Wallet",
        description: "Slim bi‑fold wallet with 6 card slots.",
        price: 899,
        category: "Accessories",
      },
      {
        name: "Canvas Backpack",
        description: "Everyday backpack with padded laptop sleeve.",
        price: 1799,
        category: "Accessories",
      },
      {
        name: "Stainless Water Bottle",
        description: "Insulated 750ml bottle, keeps drinks cold.",
        price: 599,
        category: "Home",
      },
      {
        name: "Desk Lamp Warm White",
        description: "Minimal lamp with warm LED light.",
        price: 1299,
        category: "Home",
      },
      {
        name: "Cotton Bedsheet Set",
        description: "Double bedsheet with 2 pillow covers.",
        price: 1199,
        category: "Home",
      },
      {
        name: "Sports Cap",
        description: "Adjustable strapback cap.",
        price: 399,
        category: "Accessories",
      },
      {
        name: "Formal Shirt",
        description: "Slim fit cotton formal shirt.",
        price: 1399,
        category: "Fashion",
      },
      {
        name: "Casual Chinos",
        description: "Tapered chinos with stretch.",
        price: 1699,
        category: "Fashion",
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable speaker with deep bass.",
        price: 1899,
        category: "Electronics",
      },
      {
        name: "Table Organizer",
        description: "Wooden desk organizer for stationery.",
        price: 699,
        category: "Home",
      },
      {
        name: "Analog Wrist Watch",
        description: "Minimal dial with leather strap.",
        price: 2199,
        category: "Accessories",
      },
      {
        name: "Gym Duffle Bag",
        description: "Spacious duffle with shoe compartment.",
        price: 1499,
        category: "Accessories",
      },
      {
        name: "Hoodie Oversized",
        description: "Fleece-lined hoodie for winters.",
        price: 1999,
        category: "Fashion",
      },
    ];

    // Avoid duplicating by name
    for (const p of products) {
      const exists = await productModel.findOne({ name: p.name });
      if (exists) continue;
      await productModel.create({
        name: p.name,
        description: p.description,
        price: p.price,
        quantity: 10,
        category: catDocs[p.category]._id,
      });
    }

    console.log("Seed completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error", err);
    process.exit(1);
  }
};

run();

