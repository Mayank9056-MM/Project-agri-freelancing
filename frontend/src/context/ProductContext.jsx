import {
  bulkUploadProductsApi,
  createProductApi,
  deleteProductApi,
  getAllProductApi,
  getLowStockProductsApi,
  getProductBySkuApi,
  getProductFromBarcodeApi,
  updateProductApi,
} from "@/services/productService";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Retrieves all products from the database.
   *
   * @returns {Promise<void>} A promise that resolves when all products have been retrieved.
   */
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProductApi();
      setProducts(res.products || []);
      return res.products;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates a new product in the database.
   *
   * @param {object} data - The data to send with the request. Must be a FormData object.
   * @returns {Promise<void>} A promise that resolves when the product has been created.
   * @throws {Error} - if something goes wrong while creating the product
   */
  const createProduct = async (data) => {
    setLoading(true);
    await createProductApi(data)
      .then((res) => {
        toast.success(res?.message || "Product created successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message || "Something went wrong!");
      })
      .finally(() => setLoading(false));
  };

  /**
   * Updates a product in the database.
   *
   * @param {string} id - The ID of the product to update.
   * @param {object} data - The data to send with the request. Must be a FormData object.
   * @returns {Promise<void>} A promise that resolves when the product has been updated.
   * @throws {Error} - if something goes wrong while updating the product
   */
  const updateProduct = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateProductApi(id, data);
      toast.success(res?.message || "Product updated successfully!");
      await getAllProducts();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a product from the database by ID.
   *
   * @param {string} id - The ID of the product to delete.
   *
   * @returns {Promise<void>} A promise that resolves when the product has been deleted.
   * @throws {Error} - if something goes wrong while deleting the product
   */
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const res = await deleteProductApi(id);
      toast.success(res?.message || "Product deleted successfully!");
      await getAllProducts();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retrieves a product from the database by SKU.
   *
   * @param {string} sku - The SKU of the product to retrieve.
   * @returns {Promise<object>} A promise that resolves with the product object.
   * @throws {Error} - if something goes wrong while fetching the product
   */
  const getProductBySku = async (sku) => {
    setLoading(true);
    try {
      const res = await getProductBySkuApi(sku);

      console.log(res);
      return res.product;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Bulk uploads products to the database.
   *
   * @param {object[]} data - An array of objects containing the following:
   *   - sku: The SKU of the product.
   *   - name: The name of the product.
   *   - price: The price of the product.
   *   - quantity: The quantity of the product in stock.
   *   - description: The description of the product.
   *   - image: The image of the product.
   * @returns {Promise<object>} A promise that resolves with an object containing the IDs of the created products.
   * @throws {Error} - if something goes wrong while bulk uploading products
   */
  const bulkUpload = async (data) => {
    setLoading(true);
    try {
      const res = await bulkUploadProductsApi(data);
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getLowStockProducts = async () => {
    setLoading(true);
    try {
      const res = await getLowStockProductsApi();
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductFromBarcode = async (barcode) => {
    setLoading(true);
    try {
      const res = await getProductFromBarcodeApi(barcode);
      return { success: true, product: res.product };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Product not found",
      };
    } finally {
      setLoading(false);
    }
  };

  const restockProduct = async (sku, quantity) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("stock", quantity);

      const res = await updateProductApi(sku, data);
      toast.success("Product restocked successfully!");
      await getAllProducts();
      return res;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to restock product");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    getAllProducts,
    products,
    createProduct,
    setProducts,
    updateProduct,
    deleteProduct,
    loading,
    getProductBySku,
    bulkUpload,
    getLowStockProducts,
    getProductFromBarcode,
    restockProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
