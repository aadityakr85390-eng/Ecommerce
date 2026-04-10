import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }
    const existing = await categoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(200)
        .send({ success: false, message: "Category already exists" });
    }
    const category = await categoryModel.create({ name: name.trim() });
    return res.status(201).send({ success: true, message: "Category created", category });
  } catch (error) {
    console.log("CREATE CATEGORY ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error creating category", error });
  }
};

export const listCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).sort({ name: 1 });
    return res.status(200).send({ success: true, categories });
  } catch (error) {
    console.log("LIST CATEGORY ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error listing categories", error });
  }
};

