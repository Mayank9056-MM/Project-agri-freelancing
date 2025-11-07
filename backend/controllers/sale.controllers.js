import mongoose from "mongoose";
import Sale from "../models/Sale.model.js";
import Product from "../models/Product.model.js";
import Counter from "../models/Counter.model.js"; // for saleId counter
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const initiateStripeCheckout = asyncHandler(async (req, res) => {
  const { items, paymentMethod } = req.body;

  console.log(items, paymentMethod);

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items to checkout" });
  }

  const today = new Date();
  const datePart = today.toISOString().split("T")[0].replace(/-/g, "");

  const counter = await Counter.findOneAndUpdate(
    { date: datePart },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const saleId = `S${datePart}-${String(counter.sequence).padStart(3, "0")}`;

  // Convert items to Stripe's line_items format
  const line_items = items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        metadata: { sku: item.sku },
      },
      unit_amount: Math.round(item.price * 100), // Stripe expects paise
    },
    quantity: item.qty,
  }));

  console.log(line_items, "line_items");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "upi"],
    line_items,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pos`,
  });

  await Sale.create({
    saleId,
    items,
    total: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    paymentMethod: paymentMethod || "card", // or "upi"
    paymentStatus: "pending",
    paymentId: session.id,
    createdBy: req.user._id,
  });

  console.log(session);

  res.status(200).json({ id: session.id, url: session.url });
});

/**
 * Handles Stripe webhook events.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} A promise that resolves when the webhook is handled.
 *
 * @throws {Error} Error when the webhook is invalid.
 */
export const handleStripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.log(error);
    return res.status(400).json(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const purchaseItems = await Sale.findOne({
      paymentId: session.id,
    });

    if (!purchaseItems) {
      return res.status(400).json({ message: "No items to checkout" });
    }

    purchaseItems.total = session.amount_total
      ? session.amount_total / 100
      : purchase.total;
    purchaseItems.paymentStatus = "paid";
    await purchaseItems.save();

    return res.status(200).json({ received: true });
  }
};


/**
 * Creates a new sale record in the database.
 *
 * @param {Object} req.body - The request body object.
 * @param {Object} req.body.items - An array of objects containing the following:
 *   - sku: The SKU of the product being sold.
 *   - qty: The quantity of the product being sold.
 *   - price: The unit price of the product being sold.
 * @param {string} req.body.paymentMethod - The method of payment for the sale.
 * @param {string} req.body.paymentStatus - The status of the payment for the sale.
 *
 * @returns {Promise<Object>} A promise that resolves with the created sale object.
 *
 * @throws {Error} Error when the sale is invalid (e.g. no items, insufficient stock).
 */
export const createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod, paymentStatus } = req.body;
    const createdBy = req.user?._id;

    // ---------- Validation ----------
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Sale must include at least one item.");
    }
    if (!paymentMethod) {
      throw new Error("Payment method is required.");
    }

    // ---------- Verify all products ----------
    for (const item of items) {
      const product = await Product.findOne({ sku: item.sku }).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.sku}`);
      }
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    // ---------- Generate unique Sale ID ----------
    const today = new Date();
    const datePart = today.toISOString().split("T")[0].replace(/-/g, "");

    const counter = await Counter.findOneAndUpdate(
      { date: datePart },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, session }
    );

    const saleId = `S${datePart}-${String(counter.sequence).padStart(3, "0")}`;

    // ---------- Calculate total ----------
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    // ---------- Create sale ----------
    const [sale] = await Sale.create(
      [
        {
          saleId,
          items,
          total,
          paymentMethod,
          paymentStatus,
          createdBy,
        },
      ],
      { session }
    );

    // ---------- Decrease stock in bulk ----------
    const stockUpdates = items.map((item) => ({
      updateOne: {
        filter: { sku: item.sku },
        update: { $inc: { stock: -item.qty } },
      },
    }));

    await Product.bulkWrite(stockUpdates, { session });

    // ---------- Commit transaction ----------
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(sale);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error); // handled by your global error middleware
  }
};


/**
 * Retrieves all sales from the database.
 *
 * @returns {Promise<Object>} A promise that resolves with a JSON object containing the following:
 *   - status: The status code of the response.
 *   - sales: An array of sale objects.
 *   - message: A message indicating the success of the operation.
 *
 * @throws {Error} Error when something goes wrong while fetching sales.
 */
export const getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ status: 200, sales, message: "Sales fetched successfully" });
  } catch (error) {
    next(error);
  }
};
