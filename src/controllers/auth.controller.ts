import User from "../models/user.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
// import { Role } from "../types/enum.types";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { comparePassword, hashPassword } from "../utils/bcrypt.utilis";
import { generateJwtToken } from "../utils/jwt.utilis";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/cloudinary.utils";

const folder = "/profile_image";
//! register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;
  const image = req.file;
  console.log(image);
  if (!full_name) {
    throw new AppError("full_name is required", 404);
  }
  if (!email) {
    throw new AppError("email is required", 404);
  }
  if (!password) {
    throw new AppError("password is required", 404);
  }
  //* create User instance
  const user = new User({ full_name, email, password, phone });

  //* phash password
  const hash = await hashPassword(password);
  user.password = hash;

  //! handle profile image
  if (image) {
    const { path, public_id } = await sendFileToCloudinary(image, folder);
    user.profile_image = {
      path,
      public_id,
    };
  }

  //* save user
  await user.save();

  //* success response
  sendResponse(res, {
    message: "Account created",
    data: user,
    statusCode: 201,
  });
});

//! login
export const login = catchAsync(async (req: Request, res: Response) => {
  //* login
  //* email password <- req.body
  const { email, password } = req.body;

  if (!email) {
    //   const error: any = new Error("email is required");
    //   error.statusCode = 404;
    //   error.status = "fail";
    //   throw error;
    throw new AppError("email is required", 404);
  }
  if (!password) {
    // const error: any = new Error("password is required");
    // error.statusCode = 404;
    // error.status = "fail";
    // throw error;
    throw new AppError("password is required", 404);
  }

  // * find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("email or password does not matched", 400);
  }

  // * compare password
  //const isPasswordMatched = PASSWORD ==== USER.PASSWORD;
  const isPasswordMathed = await comparePassword(password, user.password);

  if (!isPasswordMathed) {
    throw new AppError("email or password does not match", 400);
  }

  // todo: generate access token -> jwt
  const payload = {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
  const access_token = generateJwtToken(payload);

  //* success response
  sendResponse(res, {
    message: "Login successful",
    data: { user, access_token },
    statusCode: 201,
  });
});

//! update profile
// export const update = catchAsync(
//   async (req: Request, res: Response, next: NextFunction)=> {
//   const { email } = req.body;

//   },
// )
// //! get profile

//! change password

//! hash password
// const hash = await hashPassword(password);
// User.password = hash;

//! handle profile image

export const changeProfilePitcure = catchAsync(
  async (req: Request, res: Response) => {
    const image = req.file as Express.Multer.File;
    const { id } = req.params;

    if (!image) {
      throw new AppError("profile image required", 400);
    }
    //! find user
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new AppError("user account not found", 400);
    }

    //! upload image to cloud
    const { path, public_id } = await sendFileToCloudinary(image, folder);

    //! delete old image
    if (user?.profile_image?.public_id) {
      await deleteFileFromCloudinary(user.profile_image.public_id);
    }
    //! assignn new image to user
    user.profile_image = {
      path,
      public_id,
    };

    //! save user
    await user.save();

    sendResponse(res, {
      message: "profile image updated",
      data: user,
      statusCode: 200,
    });
  },
);
