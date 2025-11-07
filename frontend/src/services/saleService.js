import api from "./api";

/**
 * Retrieves all sales from the database.
 *
 * @returns {Promise<object[]>} A promise that resolves with an array of sale objects.
 */
export const getAllSalesApi = async () => {
  try {
    const res = await api.get("sale/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Creates a new sale in the database.
 *
 * @param {object} data - The data to send with the request. Must contain the following:
 *   - items: An array of objects containing the following:
 *     - sku: The SKU of the product being sold.
 *     - qty: The quantity of the product being sold.
 *     - price: The unit price of the product being sold.
 *   - paymentMethod: The method of payment for the sale.
 *   - paymentStatus: The status of the payment for the sale.
 * @returns {Promise<object>} A promise that resolves with the created sale object.
 */
export const createSaleApi = async (data) => {
  try {
    const res = await api.post("sale/", data);
    return res.data;
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
 */
export const initiateStripeCheckoutApi = async (items, PaymentMethod) => {
  try {
    const res = await api.post("sale/checkout/create-checkout-session", {
      items,
      PaymentMethod,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves the status of a sale by its ID.
 *
 * @param {string} id - The ID of the sale to be fetched.
 *
 * @returns {Promise<Object>} A promise that resolves with an object containing the status of the sale.
 *
 * @throws {Error} - if something goes wrong while fetching the sale
 */
export const getSaleStatusApi = async (id) => {
  try {
    const res = await api.get(`sale/verify-payment/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
