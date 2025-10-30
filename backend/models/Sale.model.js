import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    saleId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    items: {
      type: [saleItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "At least one item is required"],
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "bank"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
