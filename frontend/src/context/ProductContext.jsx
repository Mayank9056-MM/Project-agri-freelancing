import { createProductApi, deleteProductApi, getAllProductApi, getProductBySkuApi, updateProductApi } from "@/services/productService";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

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
    setLoading(true);
    await getAllProductApi()
      .then((res) => {
        setProducts(res?.products);
        console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

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

    // ✏️ Update
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

  // ❌ Delete
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

  const getProductBySku = async(sku) => {
    try {
      const res = await getProductBySkuApi(sku);

      console.log(res);
      return res.product

    } catch (error) {
      console.log(error)
    }
  }

  const value = {
    getAllProducts,
    products,
    createProduct,
    setProducts,
    updateProduct,
    deleteProduct,
    loading,
    getProductBySku
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
