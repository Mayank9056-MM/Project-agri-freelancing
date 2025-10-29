import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// helper functions
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User not found, please register");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

// main functions
export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "some fields are missings");
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(403, "user already exists");
  }

  const avatarLocalFilePath = req?.file.avatar;

  if (!avatarLocalFilePath) {
    throw new ApiError(400, "avatar local file path not found");
  }

  try {
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);

    if (!avatar) {
      throw new ApiError(500, "something went wrong while uploading avatar");
    }
  } catch (error) {
    console.log("error in register user while uploading avatar", error);
    throw new ApiError(500, "something went wrong while uploading avatar", [
      error,
    ]);
  }

  const user = {
    fullName,
    email,
    avatar: avatar?.secureUrl,
    password,
  };

  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "user created successfully"));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new ApiError(400, "email or password is missing");
  }

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(400, "user not found. Please register");
  }

  const isValidPassword = await User.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, user, "user loggedIn successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "refresh token not found");
  }

  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(400, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const options = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, "access token renew successfully"));
  } catch (error) {}
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

export const currentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

export const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalFilePath = req?.file?.avatar;

  if (!avatarLocalFilePath) {
    throw new ApiError(400, "avatar local path not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath);

  if (!avatar) {
    throw new ApiError(400, "something went wrong while updating avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.secureUrl,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(400, "something went wrong while updating avatar");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: updatedUser }, "avatar updated successfully")
    );
});
