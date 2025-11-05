import Product from "../models/Product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * Create a new product
 * @param {Object} req.body - product data
 * @param {Object} req.file - product image
 * @returns {Object} - created product
 * @throws {Error} - if some fields are missing or while uploading image or creating product
 */
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

/**
 * Get all products
 * @returns {Object} - response with success status, fetched products and message
 * @throws {Error} - if something goes wrong while fetching products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a product
 * @param {Object} req.body - product data
 * @param {string} req.params.sku - sku of the product to be updated
 * @returns {Object} - response with success status, updated product and message
 * @throws {Error} - if something goes wrong while updating product
 */
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

/**
 * Delete a product by sku
 * @param {string} req.params.sku - sku of the product to be deleted
 * @returns {Object} - response with success status, message and deleted product
 * @throws {Error} - if something goes wrong while deleting product
 */
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

/**
 * Get a product by sku
 * @param {string} req.params.sku - sku of the product to be fetched
 * @returns {Object} - response with success status, fetched product and message
 * @throws {Error} - if something goes wrong while fetching product
 */
export const getProductBySku = async (req, res) => {
  try {
    const sku = req.params.sku;

    if (!sku) {
      throw new Error("sku is required");
    }

    const product = await Product.findOne({ sku });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      success: true,
      product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Bulk upload products
 * @param {Object} req.body - request body object containing a products array
 * @param {Object} res - response object
 * @returns {Object} - response with success status, count of uploaded products and message
 * @throws {Error} - if something goes wrong while bulk uploading products
 */
export const bulkUploadProducts = async (req, res) => {
  try {
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No product data found." });
    }

    const validProducts = products.map((p) => ({
      name: p.name,
      price: Number(p.price) || 0,
      category: p.category || "Uncategorized",
      stock: Number(p.stock) || 0,
      unit: p.unit || "piece",
      description: p.description || "",
      low_stock_threshold: p.low_stock_threshold || 0,
    }));

    await Product.insertMany(validProducts, { ordered: false });

    res.status(201).json({
      message: `${validProducts.length} products uploaded successfully`,
      count: validProducts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Bulk upload failed",
      error: error.message,
    });
  }
};
