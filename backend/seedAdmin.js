import mongoose from "mongoose";
import User from "./models/User.model.js";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("Cloudinary config:", cloudinary.config());

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "adminAvatar",
    });

    console.log("File upload on cloudinary. File src: ", response.url);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    return null;
  }
};

const createAdmin = async () => {
  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("Creating admin role...");
    let avatar;
    try {
     const imagePath = path.join(__dirname, "public", "admin.png");
      console.log("Resolved image path:", imagePath);
      console.log("File exists?", fs.existsSync(imagePath));
      avatar = await uploadOnCloudinary(imagePath);

      console.log(avatar);

      if (!avatar) {
        console.error("❌ Failed to upload avatar");
        await mongoose.connection.close();
        return process.exit(1);
      }
    } catch (error) {
      console.log(error);

      throw new Error("Failed to upload avatar", avatar);
    }

    admin = await User.create({
      fullName: "owner",
      email: "admin@gmail.com",
      role: "admin",
      password: "123456789",
      avatar: avatar?.secure_url,
    });

    mongoose.connection.close();
    console.log("Admin created successfully!");
    return process.exit(0);
  }
  console.log("Admin already exists.");
  return process.exit(0);
};

createAdmin();
