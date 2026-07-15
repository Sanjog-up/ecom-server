import mongoose from "mongoose";
import { Role } from "../types/enum.types";
console.log("Role values:", Object.values(Role));

// [profile_image]:{_id: path}
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
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be 6 char. long"],
    },
    phone: {
      type: String,
      minLength: [10, "phone must be 10 digits"],
    },
    //! role
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
  
  //! profile image:{path: ``,public_id:``}
  profile_image:{
    type: {
      path:{
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    }
  } ,
  },
  { timestamps: true },
)

//! model
const User = mongoose.model("user", userSchema);
export default User;
