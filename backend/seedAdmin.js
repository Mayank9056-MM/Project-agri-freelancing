import mongoose from "mongoose";
import User from "./models/User.model.js";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import { uploadOnCloudinary } from "./utils/cloudinary.js";

dotenv.config();

const createAdmin = async (req, res) => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("Creating admin role...");
    let avatar;
    try {
       avatar = uploadOnCloudinary("/public/admin.svg");

      if (!avatar) {
        return res
          .status(400)
          .json({
            message: "somethng went wrong while uploading image for admin",
          });
      }
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({
          message: "somethng went wrong while uploading image for admin",
        });
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
