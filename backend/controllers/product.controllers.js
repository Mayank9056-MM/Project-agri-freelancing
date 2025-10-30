import Product from "../models/Product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

    if (req.file) {
      const imageLocalPath = req.file?.image;

      try {
        const image = await uploadOnCloudinary(imageLocalPath);

        if (!image) {
          throw new Error("something went wrong while uploading image");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock,
      unit,
      image: image.secureUrl || undefined,
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

    const productToUpdate = await Product.findOne({ sku: skuId });

    if (!productToUpdate)
      return res.status(404).json({ message: "Product not found" });

    const { name, category, price, stock, unit, barcode, low_stock_threshold } =
      req.body;

    if (req.file) {
      try {
        const image = await uploadOnCloudinary(req.file?.image);

        if (!image) {
          throw new Error("something went wrong while uploading image");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }

    const fields = {
      name: name || product.name,
      category: category || product.category,
      price: price || product.price,
      stock: stock || product.stock,
      unit: unit || product.unit,
      barcode: barcode || product.barcode,
      low_stock_threshold: low_stock_threshold || product.low_stock_threshold,
      image: image?.secureUrl || product.image,
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
