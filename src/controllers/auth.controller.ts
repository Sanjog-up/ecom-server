import User from "../models/user.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Role } from "../types/enum.types";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { hashPassword } from "../utils/bcrypt.utilis";


//! register
export const register = catchAsync(async (req: Request,res: Response) => {
    const { full_name, email, password, phone } = req.body;
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
    const user = new User({ full_name, email, password, phone, role: Role.USER});

    //! handle profile image


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
export const login = catchAsync(async (
  req: Request,
  res: Response,
) => {
  //* login
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
    //* user exists or not/find user by email
    const user = await User.findOne({ email: email });


    // * find user by email
const user = await User.findOne({ email: email});
if(!user){
  throw new AppError("email or password does not matched", 400);

}

// * compare password
//const isPasswordMatched = PASSWORD ==== USER.PASSWORD;
const isPassword 
    if (!user) {
      const error: any = new Error("password or email invalid");
      error.statusCode = 401;
      error.status = "fail";
      throw error;
    }

    //* pasd matches or not
    const isPasswordMatched = password === user.password;
    if (!isPasswordMatched) {
      const error: any = new Error("password or email invalid");
      error.statusCode = 401;
      error.status = "fail";
      throw error;
      throw new AppError
    }

// todo: generate access token -> jwt
const payload = {
  _id: User._id,
  full_name: User.full_name,
  email: User.getMaxListeners,
  role: user.role,
}
const access_token = generateJwtToken(payload);
    //* success response
    sendResponse(res,{
       message: "Login successful",
      data: {user,
      access_token,
    },
      statusCode: 201,
  });
});


//! update profile
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction)=> {
    // try logic
  },
)
//! get profile

//! change password

//! hash password 
const hash = await hashPassword(password);
User.password = hash;

//! handle profile image

//* save user
await user.save() 