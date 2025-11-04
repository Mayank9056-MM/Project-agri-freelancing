import { createSaleApi, getAllSalesApi } from "@/services/saleService";
import { createContext } from "react";

export const SaleContext = createContext();

export const SaleProvider = ({ children }) => {
  const getAllSales = async () => {
    try {
      const res = await getAllSalesApi();
      console.log(res);
      return res.sales;
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (data) => {
    try {
      const res = await createSaleApi(data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    getAllSales,
    createSale,
  };

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
};
