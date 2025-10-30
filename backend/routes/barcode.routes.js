import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { generateBarcode } from "../controllers/barcode.controllers.js";

const barcodeRouter = express.Router();

barcodeRouter.route("/").get(verifyAuth, generateBarcode);

export default barcodeRouter;
