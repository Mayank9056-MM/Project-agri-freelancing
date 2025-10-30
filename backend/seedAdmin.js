import mongoose from "mongoose";
import User from "./models/User.model.js";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("Creating admin role...");
    admin = await User.create({
      fullName: "owner",
      email: "admin@gmail.com",
      role: "admin",
      password: "123456789",
    });

    mongoose.connection.close();
    console.log("Admin created successfully!");
    return process.exit(0);
  }
  console.log("Admin already exists.");
  return process.exit(0);
};

createAdmin();
