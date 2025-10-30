import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { createSale, getAllSales } from "../controllers/sale.controllers.js";

const saleRouter = express.Router();

saleRouter.route("/").post(verifyAuth, createSale).get(verifyAuth, getAllSales);

export default saleRouter;
