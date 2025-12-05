import Product from "../models/Product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendLowStockEmail } from "../utils/mailer.js";

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

    // send email if stock is low
    if (product.stock < product.low_stock_threshold) {
      await sendLowStockEmail(product);
      product.alertSent = true;
      await product.save();
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

    // send email
    if (updateProduct.stock < updateProduct.low_stock_threshold) {
      await sendLowStockEmail(updatedProduct);
      updateProduct.alertSent = true;
      await updateProduct.save();
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
    console.log(products);

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No product data found." });
    }

    const existingCount = await Product.countDocuments();

    console.log(existingCount);

    const validProducts = products.map((p, index) => ({
      sku: `SKU${String(existingCount + index + 1).padStart(3, "0")}`,
      barcode: String(Math.floor(100000000000 + Math.random() * 900000000000)),
      name: p.name,
      price: Number(p.price) || 0,
      category: p.category || "Uncategorized",
      stock: Number(p.stock) || 0,
      unit: p.unit || "piece",
      description: p.description || "",
      low_stock_threshold: Number(p.low_stock_threshold) || 0,
    }));

    console.log(validProducts);

    const insertedProducts = await Product.insertMany(validProducts, {
      ordered: false,
    });

    // send email
    for (const product of insertedProducts) {
      if (product.stock < product.low_stock_threshold) {
        await sendLowStockEmail(product);
        product.alertSent = true;
        await product.save();
      }
    }

    console.log(insertedProducts);

    res.status(201).json({
      message: `${insertedProducts.length} products uploaded successfully`,
      count: insertedProducts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Bulk upload failed",
      error: error.message,
    });
  }
};


/**
 * Retrieves all products with low stock (i.e. stock < low_stock_threshold)
 * and sorts them by their stock in ascending order.
 * 
 * For each product, the following fields are returned:
 *   - id
 *   - sku
 *   - name
 *   - currentStock
 *   - minStock (i.e. low_stock_threshold)
 *   - reorderPoint (i.e. 0.8 * low_stock_threshold)
 *   - price
 *   - category
 *   - supplier
 *   - lastRestocked (i.e. updated_at)
 *   - status (i.e. low or critical)
 * 
 * If a product's stock is less than or equal to half of its low stock threshold,
 * it is marked as "critical". Otherwise, it is marked as "low".
 * 
 * If a product's alertSent field is false, an email is sent to the admin
 * and the field is set to true.
 * 
 * @returns {Promise<Object>} A promise that resolves with a JSON object containing
 * the fetched products and a success message.
 * 
 * @throws {Error} If something goes wrong while fetching products.
 */
export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: { $lt: ["$stock", "$low_stock_threshold"] }
    }).sort({ stock: 1 });

    const mapped = await Promise.all(
      products.map(async (p) => {
        let status = "low";
        if (p.stock <= p.low_stock_threshold / 2) status = "critical";

        // Send email only once
        if (!p.alertSent) {
          await sendLowStockEmail(p);
          p.alertSent = true;
          await p.save();
        }

        return {
          id: p._id,
          sku: p.sku,
          name: p.name,
          currentStock: p.stock,
          minStock: p.low_stock_threshold,
          reorderPoint: Math.round(p.low_stock_threshold * 0.8),
          price: p.price,
          category: p.category,
          supplier: p.supplier || "Unknown",
          lastRestocked: p.updatedAt,
          status,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully",
      products: mapped,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Retrieves a product by its barcode.
 *
 * @param {string} req.params.code - barcode of the product to retrieve
 * @returns {Object} - response with success status, fetched product and message
 * @throws {Error} - if something goes wrong while fetching product
 */
export const getProductByBarcode = async (req, res) => {
  try {
    const { code } = req.params;

    console.log(code);
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Barcode is required",
      });
    }

    // find by barcode
    const product = await Product.findOne({ barcode: code });

    console.log(product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found for this barcode",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("Error fetching product by barcode:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching product by barcode",
    });
  }
};
