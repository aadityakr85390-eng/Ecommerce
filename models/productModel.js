import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    quantity: { type: Number, default: 0 },
    photoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("products", productSchema);

