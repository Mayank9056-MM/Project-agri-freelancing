import {
  createSaleApi,
  getAllSalesApi,
  initiateStripeCheckoutApi,
} from "@/services/saleService";
import { createContext } from "react";

export const SaleContext = createContext();

export const SaleProvider = ({ children }) => {
  /**
   * Retrieves all sales from the database.
   *
   * @returns {Promise<Object[]>} A promise that resolves with an array of sale objects.
   *
   * @throws {Error} - if something goes wrong while fetching sales.
   */
  const getAllSales = async () => {
    try {
      const res = await getAllSalesApi();
      console.log(res);
      return res.sales;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Creates a new sale record in the database.
   *
   * @param {object} data - The data to send with the request. Must contain the following:
   *   - items: An array of objects containing the following:
   *     - sku: The SKU of the product being sold.
   *     - qty: The quantity of the product being sold.
   *     - price: The unit price of the product being sold.
   *   - paymentMethod: The method of payment for the sale.
   *   - paymentStatus: The status of the payment for the sale.
   *
   * @returns {Promise<Object>} A promise that resolves with the created sale object.
   *
   * @throws {Error} - if something goes wrong while creating the sale
   */
  const createSale = async (data) => {
    try {
      const res = await createSaleApi(data);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Initiates a Stripe checkout session for the given items and payment method.
   *
   * @param {Object[]} items - An array of objects containing the following:
   *   - sku: The SKU of the product being sold.
   *   - qty: The quantity of the product being sold.
   *   - price: The unit price of the product being sold.
   * @param {string} PaymentMethod - The payment method for the sale.
   * @returns {Promise<Object>} A promise that resolves with the Stripe checkout session object.
   *
   * @throws {Error} - if something goes wrong while initiating the checkout
   */
  const initiateStripeCheckout = async (items, PaymentMethod) => {
    try {
      const res = await initiateStripeCheckoutApi(items, PaymentMethod);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    getAllSales,
    createSale,
    initiateStripeCheckout,
  };

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
};
