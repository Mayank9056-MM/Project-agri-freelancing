import jwt from "jsonwebtoken";
import User  from "../models/User.model.js";

export const verifyAuth = async (req, _, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", ""); // if sent from header/mobile

  if (!accessToken) {
    throw new Error("Unathorized");
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id)

    if (user) {
      throw new Error("Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new Error(error?.message || "Invalid access token");
  }
};

export const verifyAdmin = (req, _, next) => {
  if (req?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  next();
};