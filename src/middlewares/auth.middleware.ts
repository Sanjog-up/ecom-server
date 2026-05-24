import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import { verifyToken }  from "../utils/jwt.utilis";
import ENV_CONFIG from "../config/env.config";
import { Role } from "../types/enum.types";


export const authenticate = (roles?: Role[]) =>{
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            //! get token from req cookie
            const cookies = req.cookies;
            const access_token = cookies["access_token"]; 
            console.log(access_token);

            if(!access_token){
                throw new AppError("Unauthorized. Access denied", 401);
            }

            //! verify
            const decoded_data: any = verifyToken(access_token);
            if(!decoded_data){
                throw new AppError("Unauthorized. Access denied", 401);
            }
            if(!access_token){
                throw new AppError("Unauthorized. Access denied", 401);
            }

            //! check token expired or not
            // current time milisecond
            // exp - sec 
            if(Date.now()> decoded_data.exp * 1000){
                // clear
                res.clearCookie("access_token", {
                    httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
                    maxAge: Date.now(),
                    secure: ENV_CONFIG.node_env === "development" ? false : true,
                    sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
                });
                throw new AppError("Token expired. Access denied", 401);
            }

            if(roles && !roles.includes(decoded_data.role)){
                throw new AppError("Forbidden. Access denied", 403);
            }
            next();
        } catch (error) {
            next(new AppError("Something went wrong", 500));
        }
    }
}