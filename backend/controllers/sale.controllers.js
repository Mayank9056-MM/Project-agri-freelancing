import mongoose from "mongoose";
import Sale from "../models/Sale.model.js";
import Product from "../models/Product.model.js";
import Counter from "../models/Counter.model.js"; // for saleId counter

// Create Sale
export const createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod, paymentStatus } = req.body;
    const createdBy = req.user?._id;

    // ---------- Validation ----------
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Sale must include at least one item.");
    }
    if (!paymentMethod) {
      throw new Error("Payment method is required.");
    }

    // ---------- Verify all products ----------
    for (const item of items) {
      const product = await Product.findOne({ sku: item.sku }).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.sku}`);
      }
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    // ---------- Generate unique Sale ID ----------
    const today = new Date();
    const datePart = today.toISOString().split("T")[0].replace(/-/g, "");

    const counter = await Counter.findOneAndUpdate(
      { date: datePart },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, session }
    );

    const saleId = `S${datePart}-${String(counter.sequence).padStart(3, "0")}`;

    // ---------- Calculate total ----------
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    // ---------- Create sale ----------
    const [sale] = await Sale.create(
      [
        {
          saleId,
          items,
          total,
          paymentMethod,
          paymentStatus,
          createdBy,
        },
      ],
      { session }
    );

    // ---------- Decrease stock in bulk ----------
    const stockUpdates = items.map((item) => ({
      updateOne: {
        filter: { sku: item.sku },
        update: { $inc: { stock: -item.qty } },
      },
    }));

    await Product.bulkWrite(stockUpdates, { session });

    // ---------- Commit transaction ----------
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(sale);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error); // handled by your global error middleware
  }
};

// Get all sales
export const getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ status: 200, sales, message: "Sales fetched successfully" });
  } catch (error) {
    next(error);
  }
};
