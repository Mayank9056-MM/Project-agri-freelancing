import { Product } from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, unit, barcode, low_stock_threshold } =
      req.body;

    if (
      [name, category, price, stock, unit, barcode, low_stock_threshold].some(
        (field) => field.trim() === ""
      )
    ) {
      throw new Error("some fields are missing");
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock,
      unit,
      barcode,
      low_stock_threshold,
    });

    if (!product) {
      throw new Error("something went wrong while creating product");
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const skuId = req.params.sku;

    if (!skuId) return res.status(400).json({ message: "sku is required" });

    const { name, category, price, stock, unit, barcode, low_stock_threshold } =
      req.body;

    const fields = {
      name,
      category,
      price,
      stock,
      unit,
      barcode,
      low_stock_threshold,
    };

    const product = await Product.findOneAndUpdate({ sku: skuId }, fields, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const skuId = req.params.sku;

    if (!skuId) {
      throw new Error("sku is required");
    }

    const result = await Product.findOneAndDelete({ sku: req.params.sku });
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
