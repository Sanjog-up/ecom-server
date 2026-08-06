import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import { verifyToken } from "../utils/jwt.utilis";
import ENV_CONFIG from "../config/env.config";
import { Role } from "../types/enum.types";

export const authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //! get token from req cookie
      const cookies = req.cookies;
      let access_token = cookies["access_token"];
      console.log(access_token);

      if(!access_token){
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
        access_token = authHeader.split(" ")[1];
            }
        }
      if (!access_token) {
        throw new AppError("Unauthorized. Access denied", 401);
      }

      //! verify
      const decoded_data: any = verifyToken(access_token);
      if (!decoded_data) {
        throw new AppError("Unauthorized. Access denied", 401);
      }

      //! check token expired or not
      // current time milisecond
      // exp - sec
      if (Date.now() > decoded_data.exp * 1000) {
        // clear
        res.clearCookie("access_token", {
          httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
          maxAge: Date.now(),
          secure: ENV_CONFIG.node_env === "development" ? false : true,
          sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
        });
        throw new AppError("Token expired. Access denied", 401);
      }

      console.log("user role:", decoded_data.role, "| allowed roles:", roles);
      if (roles && !roles.includes(decoded_data.role)) {
        throw new AppError("Forbidden. Access denied", 403);
      }

      //! add loggedin user to req object
      req.user = {
        _id: decoded_data._id,
        email: decoded_data.email,
        role: decoded_data.role,
        full_name: decoded_data.full_name,
        is_verified: decoded_data.is_verified,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireVerified = async(req:Request, res:Response, next:NextFunction) => {
  if(!req.user?.is_verified){
    return next(new AppError("please verify your email to continue", 403))
  }
  next();
}