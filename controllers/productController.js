import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, categoryId, quantity } = req.body;
    if (!name?.trim()) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }
    if (!price || Number(price) <= 0) {
      return res.status(400).send({ success: false, message: "Valid price is required" });
    }
    if (!categoryId) {
      return res.status(400).send({ success: false, message: "Category is required" });
    }

    const cat = await categoryModel.findById(categoryId);
    if (!cat) {
      return res.status(400).send({ success: false, message: "Invalid category" });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await productModel.create({
      name: name.trim(),
      description: description || "",
      price: Number(price),
      category: categoryId,
      quantity: Number(quantity || 0),
      photoUrl,
    });

    return res.status(201).send({ success: true, message: "Product created", product });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error creating product", error });
  }
};

export const listProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });
    return res.status(200).send({ success: true, products });
  } catch (error) {
    console.log("LIST PRODUCT ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error listing products", error });
  }
};

export const getProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).populate("category", "name");
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    return res.status(200).send({ success: true, product });
  } catch (error) {
    console.log("GET PRODUCT ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error getting product", error });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, quantity } = req.body;

    const update = {};
    if (name?.trim()) update.name = name.trim();
    if (typeof description === "string") update.description = description;
    if (price !== undefined) update.price = Number(price);
    if (quantity !== undefined) update.quantity = Number(quantity);
    if (categoryId) update.category = categoryId;
    if (req.file) update.photoUrl = `/uploads/${req.file.filename}`;

    const product = await productModel.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    return res.status(200).send({ success: true, message: "Product updated", product });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error updating product", error });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    return res.status(200).send({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error deleting product", error });
  }
};

