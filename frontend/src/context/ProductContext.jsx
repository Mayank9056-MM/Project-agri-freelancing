import { createProductApi, getAllProductApi } from "@/services/productService";
import { set } from "date-fns";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  /**
   * Retrieves all products from the database.
   *
   * @returns {Promise<void>} A promise that resolves when all products have been retrieved.
   */
  const getAllProducts = async () => {
    await getAllProductApi()
      .then((res) => { setProducts(res?.products)
        console.log(res)
      })
      .catch((err) => console.log(err));
  };

  const createProduct = async (data) => {
    await createProductApi(data)
      .catch((res) => toast.success(res.message))
      .catch((err) => console.log(err));
  };

  const value = {
    getAllProducts,
    products,
    createProduct,
    setProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
