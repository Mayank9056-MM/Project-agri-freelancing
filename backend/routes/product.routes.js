import express from "express";
import { verifyAdmin, verifyAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/product.controllers.js";

const productRouter = express.Router()

productRouter.route("/").post(verifyAuth,verifyAdmin,upload.single("image"),createProduct).get(verifyAuth,verifyAdmin,getAllProducts)
productRouter.route("/:sku").patch(verifyAuth,verifyAdmin,upload.single("image"),updateProduct).delete(verifyAuth,verifyAdmin,deleteProduct)

export default productRouter;