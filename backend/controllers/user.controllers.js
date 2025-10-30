import User from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// helper functions
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found, please register");
    }

    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new Error("Something went wrong while generating access token");
  }
};

// main functions
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((field) => field.trim() === "")) {
      throw new Error("some fields are missings");
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new Error("user already exists");
    }

    const avatarLocalFilePath = req?.file;


    if (!avatarLocalFilePath) {
      throw new Error("avatar local file path not found");
    }

    try {
      const avatar = await uploadOnCloudinary(avatarLocalFilePath);

      if (!avatar) {
        throw new Error("something went wrong while uploading avatar");
      }
    } catch (error) {
      console.log("error in register user while uploading avatar", error);
      throw new Error("something went wrong while uploading avatar", [error]);
    }

    const user = {
      fullName,
      email,
      avatar: avatar?.secureUrl,
      password,
    };

    const createdUser = await User.create(user);

    if (!createdUser) {
      throw new Error("something went wrong while creating user");
    }

    return res.status(201).json(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("email or password is missing");
    }

    const user = await User.findOne({ email }).select(
      "+password +refreshToken"
    );

    if (!user) {
      throw new Error("user not found. Please register");
    }

    const isValidPassword = await User.isPasswordCorrect(password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const { accessToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const options = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("accessToken", options)
      .json("user logged out successfully");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const currentUser = async (req, res, next) => {
  return res.status(200).json(req.user, "user fetched successfully");
};

export const updateUserAvatar = async (req, res, next) => {
  const avatarLocalFilePath = req?.file;

  if (!avatarLocalFilePath) {
    throw new Error("avatar local path not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath);

  if (!avatar) {
    throw new Error("something went wrong while updating avatar");
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
    throw new Error("something went wrong while updating avatar");
  }

  return res.status(200).json({ user: updatedUser });
};
