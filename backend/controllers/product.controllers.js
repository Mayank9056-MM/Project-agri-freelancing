import { isValidObjectId } from "mongoose";
import Product from "../models/Product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, unit, barcode, low_stock_threshold } =
      req.body;

    if (
      [name, category, price, stock, unit, barcode, low_stock_threshold].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new Error("some fields are missing");
    }

    let image;

    if (req.file) {
      const imageLocalPath = req.file.path;

      try {
        image = await uploadOnCloudinary(imageLocalPath);

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
      barcode,
      low_stock_threshold,
      image: image?.secure_url || undefined,
    });

    if (!product) {
      throw new Error("something went wrong while creating product");
    }

    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({
        success: true,
        products,
        message: "Products fetched successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const skuId = req.params.sku;

    if (!skuId) return res.status(400).json({ message: "sku is required" });

    const product = await Product.findOne({ sku: skuId });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, category, price, stock, unit, barcode, low_stock_threshold } =
      req.body;

    let image;

    if (req.file) {
      try {
        image = await uploadOnCloudinary(req.file.path);

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
      image: image?.secure_url || product.image,
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { sku: skuId },
      fields,
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

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

export const getProductBySku = async (req,res) => {
  try {
    const sku = req.params.sku;

    if(!sku){
      throw new Error("sku is required");
    }

    const product = await Product.findOne({sku});
    if(!product) return res.status(404).json({message:"Product not found"});
    res.status(200).json({product});
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}
