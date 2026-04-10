import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    productOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null, index: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingCharge: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: ["demo", "razorpay"], default: "demo" },
    status: {
      type: String,
      enum: [
        "placed",
        "paid",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "failed",
      ],
      default: "placed",
    },
    paymentDetails: {
      razorpayOrderId: { type: String, default: "" },
      razorpayPaymentId: { type: String, default: "" },
      razorpaySignature: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("orders", orderSchema);
