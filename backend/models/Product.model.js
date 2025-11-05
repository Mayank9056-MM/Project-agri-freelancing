import mongoose from "mongoose";
import { PRODUCT_UNITS } from "../constants.js";

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: PRODUCT_UNITS,
      default: "pcs",
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (!this.sku) {
    const count = await mongoose.model("Product").countDocuments();
    this.sku = `SKU${String(count + 1).padStart(3, "0")}`;
  }

  if (!this.barcode) {
    const randomPart = Math.floor(100000000000 + Math.random() * 900000000000); // 12-digit number
    this.barcode = String(randomPart);
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
