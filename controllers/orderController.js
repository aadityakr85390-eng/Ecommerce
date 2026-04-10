import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const normalizeOrderItems = async (items) => {
  const ids = items.map((it) => it.id || it._id).filter(Boolean);
  const products = await productModel
    .find({ _id: { $in: ids } })
    .select("_id name price quantity createdBy");
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const normalizedItems = [];
  let totalAmount = 0;

  for (const it of items) {
    const productId = it.id || it._id;
    const product = productMap.get(String(productId));
    const qty = Math.max(1, Number(it.qty || 1));
    if (!product) continue;
    if ((product.quantity || 0) < qty) {
      return {
        error: `Insufficient stock for ${product.name}`,
      };
    }

    normalizedItems.push({
      product: product._id,
      name: product.name,
      price: Number(product.price || 0),
      qty,
      productOwner: product.createdBy || null,
    });
    totalAmount += Number(product.price || 0) * qty;
  }

  if (!normalizedItems.length) {
    return { error: "No valid items to place order" };
  }

  return { normalizedItems, totalAmount };
};

const reduceStock = async (normalizedItems) => {
  await Promise.all(
    normalizedItems.map((it) =>
      productModel.updateOne({ _id: it.product }, { $inc: { quantity: -it.qty } })
    )
  );
};

export const createOrderController = async (req, res) => {
  try {
    const { items, paymentMethod = "demo", shippingCharge = 0 } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).send({ success: false, message: "Order items are required" });
    }

    const normalized = await normalizeOrderItems(items);
    if (normalized.error) {
      return res.status(400).send({ success: false, message: normalized.error });
    }

    const validShipping = Math.max(0, Number(shippingCharge || 0));
    await reduceStock(normalized.normalizedItems);

    const order = await orderModel.create({
      buyer: req.user?._id,
      items: normalized.normalizedItems,
      totalAmount: normalized.totalAmount + validShipping,
      shippingCharge: validShipping,
      paymentMethod,
      status: paymentMethod === "razorpay" ? "paid" : "placed",
    });

    return res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR 👉", error);
    return res.status(500).send({ success: false, message: "Error creating order", error });
  }
};

export const createRazorpayOrderController = async (req, res) => {
  try {
    const { items, shippingCharge = 0 } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).send({ success: false, message: "Order items are required" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).send({
        success: false,
        message: "Razorpay keys missing on server",
      });
    }

    const normalized = await normalizeOrderItems(items);
    if (normalized.error) {
      return res.status(400).send({ success: false, message: normalized.error });
    }
    const validShipping = Math.max(0, Number(shippingCharge || 0));
    const amount = normalized.totalAmount + validShipping;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        buyerId: String(req.user?._id || ""),
      },
    });

    return res.status(200).send({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order: rpOrder,
      amount,
      currency: "INR",
    });
  } catch (error) {
    console.log("CREATE RAZORPAY ORDER ERROR 👉", error);
    return res
      .status(500)
      .send({ success: false, message: "Error creating Razorpay order", error });
  }
};

export const verifyRazorpayPaymentController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingCharge = 0,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({ success: false, message: "Invalid payment response" });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).send({ success: false, message: "Razorpay secret missing on server" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).send({ success: false, message: "Payment signature mismatch" });
    }

    const normalized = await normalizeOrderItems(items || []);
    if (normalized.error) {
      return res.status(400).send({ success: false, message: normalized.error });
    }
    const validShipping = Math.max(0, Number(shippingCharge || 0));
    await reduceStock(normalized.normalizedItems);

    const order = await orderModel.create({
      buyer: req.user?._id,
      items: normalized.normalizedItems,
      totalAmount: normalized.totalAmount + validShipping,
      shippingCharge: validShipping,
      paymentMethod: "razorpay",
      status: "paid",
      paymentDetails: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    return res.status(200).send({
      success: true,
      message: "Payment verified and order placed",
      order,
    });
  } catch (error) {
    console.log("VERIFY RAZORPAY PAYMENT ERROR 👉", error);
    return res.status(500).send({
      success: false,
      message: "Error verifying payment",
      error,
    });
  }
};

export const myOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user?._id })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      orders: orders.map((o) => ({
        _id: o._id,
        createdAt: o.createdAt,
        status: o.status,
        paymentMethod: o.paymentMethod,
        totalAmount: o.totalAmount,
        shippingCharge: o.shippingCharge || 0,
        items: (o.items || []).map((it) => ({
          name: it.name,
          qty: it.qty,
          price: it.price,
        })),
      })),
    });
  } catch (error) {
    console.log("MY ORDERS ERROR 👉", error);
    return res.status(500).send({ success: false, message: "Error loading your orders", error });
  }
};

const ADMIN_UPDATABLE_STATUS = [
  "paid",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const listAdminOrdersController = async (req, res) => {
  try {
    const adminId = String(req.user?._id || "");
    const orders = await orderModel
      .find({ "items.productOwner": adminId })
      .populate("buyer", "name email phone")
      .sort({ createdAt: -1 });

    const result = orders.map((o) => {
      const ownItems = (o.items || []).filter((it) => String(it.productOwner) === adminId);
      return {
        _id: o._id,
        status: o.status,
        paymentMethod: o.paymentMethod,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
        buyer: {
          name: o.buyer?.name || "Unknown",
          email: o.buyer?.email || "-",
          phone: o.buyer?.phone || "-",
        },
        items: ownItems.map((it) => ({
          name: it.name,
          qty: it.qty,
          price: it.price,
        })),
      };
    });

    return res.status(200).send({
      success: true,
      orders: result,
      statusOptions: ADMIN_UPDATABLE_STATUS,
    });
  } catch (error) {
    console.log("LIST ADMIN ORDERS ERROR 👉", error);
    return res.status(500).send({ success: false, message: "Error listing admin orders", error });
  }
};

export const updateAdminOrderStatusController = async (req, res) => {
  try {
    const adminId = String(req.user?._id || "");
    const { id } = req.params;
    const { status } = req.body;

    if (!ADMIN_UPDATABLE_STATUS.includes(status)) {
      return res.status(400).send({ success: false, message: "Invalid status value" });
    }

    const order = await orderModel.findOne({ _id: id, "items.productOwner": adminId });
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).send({
      success: true,
      message: "Order status updated",
      order: {
        _id: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    console.log("UPDATE ADMIN ORDER STATUS ERROR 👉", error);
    return res.status(500).send({ success: false, message: "Error updating order status", error });
  }
};

export const adminOrderStatsController = async (req, res) => {
  try {
    const adminId = String(req.user?._id || "");
    const orders = await orderModel
      .find({ "items.productOwner": adminId })
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    const productRows = await productModel
      .find({ createdBy: adminId })
      .select("_id name quantity")
      .sort({ createdAt: -1 });

    const soldByProduct = new Map();
    const customerMap = new Map();
    const recentOrders = [];
    let totalOrders = 0;
    let totalSoldQty = 0;

    for (const order of orders) {
      const ownItems = order.items.filter((it) => String(it.productOwner) === adminId);
      if (!ownItems.length) continue;
      totalOrders += 1;

      const buyerId = String(order.buyer?._id || "unknown");
      const prev = customerMap.get(buyerId) || {
        buyerId,
        name: order.buyer?.name || "Unknown",
        email: order.buyer?.email || "-",
        orders: 0,
        qty: 0,
      };
      prev.orders += 1;

      const itemSummary = ownItems.map((it) => ({ name: it.name, qty: it.qty }));
      for (const it of ownItems) {
        totalSoldQty += Number(it.qty || 0);
        prev.qty += Number(it.qty || 0);
        soldByProduct.set(
          String(it.product),
          (soldByProduct.get(String(it.product)) || 0) + Number(it.qty || 0)
        );
      }
      customerMap.set(buyerId, prev);

      recentOrders.push({
        orderId: order._id,
        buyerName: prev.name,
        buyerEmail: prev.email,
        items: itemSummary,
        createdAt: order.createdAt,
      });
    }

    const products = productRows.map((p) => ({
      id: p._id,
      name: p.name,
      sold: soldByProduct.get(String(p._id)) || 0,
      remaining: Number(p.quantity || 0),
    }));

    return res.status(200).send({
      success: true,
      stats: {
        totalOrders,
        totalSoldQty,
        totalRemainingQty: products.reduce((acc, p) => acc + p.remaining, 0),
      },
      customers: Array.from(customerMap.values()).sort((a, b) => b.qty - a.qty),
      products,
      recentOrders: recentOrders.slice(0, 20),
    });
  } catch (error) {
    console.log("ADMIN ORDER STATS ERROR 👉", error);
    return res.status(500).send({ success: false, message: "Error loading admin stats", error });
  }
};
