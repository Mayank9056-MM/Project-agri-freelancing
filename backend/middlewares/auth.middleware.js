import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyAuth = async (req, res, next) => {
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

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no user found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    throw new Error(error?.message || "Invalid access token");
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({
    success: false,
    message: "Forbidden - admin access required",
  });
};
