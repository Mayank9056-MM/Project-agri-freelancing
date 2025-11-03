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
