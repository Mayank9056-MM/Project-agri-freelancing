import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import {
  createSale,
  getAllSales,
  getSaleStatus,
  handleStripeWebhook,
  initiateStripeCheckout,
} from "../controllers/sale.controllers.js";

const saleRouter = express.Router();

saleRouter
  .route("/checkout/create-checkout-session")
  .post(verifyAuth, initiateStripeCheckout);

saleRouter.route("/verify-payment/:id").get(verifyAuth, getSaleStatus);

saleRouter
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), handleStripeWebhook);

saleRouter.route("/").post(verifyAuth, createSale).get(verifyAuth, getAllSales);

export default saleRouter;
