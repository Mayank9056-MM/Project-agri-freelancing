import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
      enum: ["kg", "pcs", "litre", "box", "packet"], // you can customize
      default: "pcs",
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true, 
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  if (!this.sku) {
    const count = await mongoose.model("Product").countDocuments();
    this.sku = `SKU${String(count + 1).padStart(3, "0")}`;
  }
  next();
});


const Product = mongoose.model("Product", productSchema);

export default Product;
