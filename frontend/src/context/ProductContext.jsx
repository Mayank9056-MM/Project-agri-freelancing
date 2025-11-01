import { getAllProductApi } from "@/services/productService";
import { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  /**
   * Retrieves all products from the database.
   *
   * @returns {Promise<void>} A promise that resolves when all products have been retrieved.
   */
  const getAllProducts = async () => {
    await getAllProductApi().then((res) => setProducts(res)).catch((err) => console.log(err))
  };

  const value = {
    getAllProducts,
    products,
    setProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
