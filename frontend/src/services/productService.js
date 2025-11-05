import api from "./api";

/**
 * Creates a new product in the database.
 *
 * @param {object} data - The data to send with the request. Must be a FormData object.
 * @returns {Promise<object>} A promise that resolves with the created product object.
 */
export const createProductApi = async (data) => {
  try {
    const res = await api.post("product/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
/**
 * Retrieves all products from the database.
 *
 * @returns {Promise<object[]>} A promise that resolves with an array of product objects.
 */

export const getAllProductApi = async () => {
  try {
    const res = await api.get("product/");
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates a product in the database.
 *
 * @param {string} sku - The SKU of the product to update.
 * @param {object} data - The data to send with the request. Must be a FormData object.
 * @returns {Promise<object>} A promise that resolves with the updated product object.
 */
export const updateProductApi = async (sku, data) => {
  try {
    const res = await api.patch(`product/${sku}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Deletes a product from the database.
 *
 * @param {string} sku - The SKU of the product to delete.
 * @returns {Promise<object>} A promise that resolves with the deleted product object.
 */

export const deleteProductApi = async (sku) => {
  try {
    const res = await api.delete(`product/${sku}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves a product from the database by SKU.
 *
 * @param {string} sku - The SKU of the product to retrieve.
 * @returns {Promise<object>} A promise that resolves with the product object.
 */
export const getProductBySkuApi = async (sku) => {
  try {
    const res = await api.get(`product/${sku}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Uploads multiple products to the database in a single request.
 *
 * @param {object[]} data - An array of objects containing the following:
 *   - sku: The SKU of the product.
 *   - name: The name of the product.
 *   - price: The price of the product.
 *   - quantity: The quantity of the product in stock.
 *   - description: The description of the product.
 *   - image: The image of the product.
 * @returns {Promise<object>} A promise that resolves with an object containing the IDs of the created products.
 */
export const bulkUploadProductsApi = async (data) => {
  try {
    console.log(data)
    const res = await api.post("product/bulk-upload", data);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves all products with low stock from the database.
 *
 * Low stock is defined as products with stock < minStock or stock < reorderPoint
 *
 * @returns {Promise<object[]>} A promise that resolves with an array of product objects with low stock.
 * @throws {Error} - if something goes wrong while fetching products
 */
export const getLowStockProductsApi = async () => {
  try {
    const res = await api.get("product/low-stock");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};