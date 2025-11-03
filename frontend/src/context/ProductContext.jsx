import { createProductApi, getAllProductApi } from "@/services/productService";
import { set } from "date-fns";
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

  const value = {
    getAllProducts,
    products,
    createProduct,
    setProducts,
    loading,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
