import express from "express";
import {
  currentUser,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAvatar,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.js";
import { verifyAdmin, verifyAuth } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter
  .route("/")
  .get(verifyAuth, currentUser)
  .patch(verifyAuth, upload.single("avatar"), updateUserAvatar)
  .post(verifyAuth, logoutUser);

userRouter.route("/get").get(verifyAuth, verifyAdmin, getAllUsers);

export default userRouter;
