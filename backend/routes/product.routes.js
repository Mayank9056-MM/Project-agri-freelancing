import express from "express";
import { verifyAdmin, verifyAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import {
  bulkUploadProducts,
  createProduct,
  deleteProduct,
  getAllProducts,
  getLowStockProducts,
  getProductByBarcode,
  getProductBySku,
  updateProduct,
} from "../controllers/product.controllers.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(verifyAuth, verifyAdmin, upload.single("image"), createProduct)
  .get(verifyAuth, getAllProducts);

productRouter.get("/low-stock", verifyAuth, verifyAdmin, getLowStockProducts);

productRouter.post("/bulk-upload", verifyAuth, verifyAdmin, bulkUploadProducts);

productRouter.get("/barcode/:code", verifyAuth, getProductByBarcode);

productRouter
  .route("/:sku")
  .patch(verifyAuth, verifyAdmin, upload.single("image"), updateProduct)
  .delete(verifyAuth, verifyAdmin, deleteProduct)
  .get(verifyAuth, verifyAdmin, getProductBySku);

export default productRouter;
