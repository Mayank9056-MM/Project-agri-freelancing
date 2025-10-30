import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";

export const createSale = async (req, res) => {
  try {
    const { items, paymentMethod, paymentStatus } = req.body;

    const createdBy = req.user._id;

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    // Generate Sale ID (like S20251029-001)
    const today = new Date();
    const datePart = today.toISOString().split("T")[0].replace(/-/g, "");
    const count = await Sale.countDocuments();
    const saleId = `S${datePart}-${String(count + 1).padStart(3, "0")}`;

    // Create sale
    const sale = await Sale.create({
      saleId,
      items,
      total,
      paymentMethod,
      paymentStatus,
      createdBy,
    });

    // Decrease stock for each product
    for (const item of items) {
      await Product.updateOne({ sku: item.sku }, { $inc: { stock: -item.qty } });
    }

    res.status(201).json({ message: "Sale recorded", sale });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("createdBy", "email role");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
