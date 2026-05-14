import mongoose from "mongoose";
import { Role } from "../types/enum.types";
console.log("Role values:", Object.values(Role));

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      minLength: [3, "Name must be 3 char. long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "user already exists with provided email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be 6 char. long"],
    },
    phone: {
      type: String,
      minLenght: [10],
    },
    //! role
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    photo: {},
  },
  { timestamps: true },
);

//! model
const User = mongoose.model("user", userSchema);
export default User;
