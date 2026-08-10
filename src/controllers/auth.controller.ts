import User from "../models/user.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Role } from "../types/enum.types";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { comparePassword, hashPassword } from "../utils/bcrypt.utilis";
import { generateJwtToken } from "../utils/jwt.utilis";
import { deleteFileFromCloudinary, sendFileToCloudinary } from "../utils/cloudinary.utils";
import ENV_CONFIG from "../config/env.config";
import { sendEmail } from "../utils/sendEmail.utils";
import jwt from "jsonwebtoken";
import { generateVerificationEmailHtml } from '../utils/email.verify';
import crypto from "crypto";
import { generateLoginSuccessEmailHtml } from "../utils/email.utils";

const folder = "/profile_image";
//! register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;
  const image = req.file;
  console.log(image);
  if (!full_name) {
    throw new AppError("full_name is required", 400);
  }
  if (!email) {
    throw new AppError("email is required", 400);
  }
  if (!password) {
    throw new AppError("password is required", 400);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    throw new AppError("please provide a valid email address", 400);
  }
  //* create User instance
  const user = new User({ full_name, email, password, phone });

  //* hash password
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


  //* generate token for verification
  const rawToken = crypto.randomBytes(32).toString("hex");
  user.verification_token = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.verificationTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const verifyUrl = `${ENV_CONFIG.allow_origin}/verify-email/${rawToken}`;
  sendEmail({
    to: user.email,
    subject: "Verify your Grey Matter account",
    html: generateVerificationEmailHtml({ full_name: user.full_name}, verifyUrl),
  })
  .catch((err)=> console.log("Failed to send verification email:", err));



  //* save user
  await user.save();

  //* generate access token -> jwt
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
      full_name: user.full_name,
      is_verified: user.is_verified,
    },
    ENV_CONFIG.jwt_secret as string,
    { expiresIn: "7d" },
  );

  // accestoken will be sent in cookie
    res.cookie("access_token", token, {
    httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
    maxAge: parseInt(ENV_CONFIG.cookie_express ?? "7") * 24 * 60 * 60 * 1000,
    secure: ENV_CONFIG.node_env === "development" ? false : true,
    sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
  });

  //* success response
  sendResponse(res, {
    message: "Account created",
    data: { user, token },
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
    throw new AppError("email is required", 400);
  }
  if (!password) {
    // const error: any = new Error("password is required");
    // error.statusCode = 404;
    // error.status = "fail";
    // throw error;
    throw new AppError("password is required", 400);
  }

  // * find user by email
  const user = await User.findOne({ email: email }).select("+password");
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
    is_verified: user.is_verified
  };
  const access_token = generateJwtToken(payload);

  // await
   sendEmail({
    to: user.email,
    subject: `Welcome ${user.full_name}`,
    html: generateLoginSuccessEmailHtml(req, {
      full_name: user.full_name,
      _id: user._id,
      email: user.email,
    }),
  }).catch((err)=> {
    console.log("Failed to send login email:", err)
  })

  //* send access_token in cookie
  res.cookie("access_token", access_token, {
    httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
    maxAge: parseInt(ENV_CONFIG.cookie_express ?? "7") * 24 * 60 * 60 * 1000,
    secure: ENV_CONFIG.node_env === "development" ? false : true,
    sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
  });
  //* success response
  sendResponse(res, {
    message: "Login successful",
    data: { user: payload, access_token },
    statusCode: 201,
  });
});

//! update profile
export const changeProfilePitcure = catchAsync(
  async (req: Request, res: Response) => {
    const image = req.file as Express.Multer.File;
    const id = req.user?._id;

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

//! change password
export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.user?._id;
    const { old_password, new_password, confirm_password } = req.body;

    if (!old_password || !new_password || !confirm_password) {
      throw new AppError("all fields are required", 400);
    }

    if (new_password !== confirm_password) {
      throw new AppError(
        "new password and confirm password does not match",
        400,
      );
    }

    //! find user
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new AppError("user account not found", 400);
    }

    //! compare old password
    const isPasswordMatched = await comparePassword(
      old_password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new AppError("old password is incorrect", 400);
    }

    //! hash new password
    const hash = await hashPassword(new_password);
    user.password = hash;

    //! save user
    await user.save();

    sendResponse(res, {
      message: "password changed successfully",
      data: null,
      statusCode: 200,
    });
  },
);
//! get profile
export  const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req?.user?._id,
    email: req?.user?.email,
  });
  if(!user){
    throw new AppError("user account not found", 400);
  }
  //! send response 
  sendResponse(res, {
    message: "profile fetched",
    data: user,
    statusCode: 200,
  }) ;
});




//* logout
export const logout = catchAsync(async (req:Request, res:Response) => {
  
  res.clearCookie("access_token", {
    httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
    maxAge: Date.now(),
    secure: ENV_CONFIG.node_env === "development" ? false : true,
    sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
    path: "/",
  });
  sendResponse(res,{
  message: "Logged out successfully",
  statusCode: 200,
  data: null,
  })
})

//! verify email
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token || Array.isArray(token)) {
    throw new AppError("verification token is required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verification_token: hashedToken,
    verificationTokenExp: { $gt: new Date() },
  }).select("+verification_token +verificationTokenExp");

  if (!user) {
    throw new AppError("invalid or expired verification link", 400);
  }

  user.is_verified = true;
  user.verification_token = undefined;
  user.verificationTokenExp = undefined;
  await user.save();

  sendResponse(res, {
    message: "email verified successfully",
    data: null,
    statusCode: 200,
  });
});

//! resend verification email
export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?._id;
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new AppError("user account not found", 400);
  }
  if (user.is_verified) {
    throw new AppError("email is already verified", 400);
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.verification_token = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.verificationTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const verifyUrl = `${ENV_CONFIG.allow_origin}/verify-email/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your Grey Matter account",
    html: generateVerificationEmailHtml({ full_name: user.full_name }, verifyUrl),
  });

  sendResponse(res, {
    message: "verification email resent",
    data: null,
    statusCode: 200,
  });
});
//! change passowrd 