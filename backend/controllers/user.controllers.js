import User from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// helper functions
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found, please register");
    }

    const accessToken = user.generateAccessToken();

    return accessToken;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while generating access token");
  }
};

// main functions
export const registerUser = async (req, res) => {
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

    const avatarLocalFilePath = req?.file.path;

    if (!avatarLocalFilePath) {
      throw new Error("avatar local file path not found");
    }

    let avatar;

    try {
      console.log(avatarLocalFilePath, "avatarLocalFilePath");

      avatar = await uploadOnCloudinary(avatarLocalFilePath);
      if (!avatar) {
        throw new Error("something went wrong while uploading avatar");
      }
    } catch (error) {
      console.log("error in register user while uploading avatar", error);
      throw new Error("something went wrong while uploading avatar", [error]);
    }

    console.log(avatar, "avatar");

    const user = {
      fullName,
      email,
      avatar: avatar?.secure_url || undefined,
      password,
    };

    const createdUser = await User.create(user);

    if (!createdUser) {
      throw new Error("something went wrong while creating user");
    }

    return res.status(201).json({
      success: true,
      user: createdUser,
      message: "user created successfully",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (req, res) => {
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

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const accessToken = await generateAccessToken(user._id);
    console.log(accessToken, "accessToken");
    const options = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ success: true, user, message: "user logged in successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const options = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    };

    return res.status(200).cookie("accessToken", options).json({
      success: true,
      data: {},
      message: "user logged out successfully",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const currentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
    message: "user fetched successfully",
  });
};

export const updateUserAvatar = async (req, res) => {
  const avatarLocalFilePath = req?.file.path;

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
        avatar: avatar.secure_url,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("something went wrong while updating avatar");
  }

  return res.status(200).json({
    success: true,
    user: updatedUser,
    message: "user avatar updated successfully",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    console.log(allUsers);

    if (!allUsers) {
      throw new Error("something went wrong while fetching users");
    }

    return res.status(200).json({
      success: true,
      users: allUsers,
      message: "users fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};
