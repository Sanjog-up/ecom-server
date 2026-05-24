import { NextFunction } from "express";
import AppError from "../utils/appError.utils";
import { verifyToken }  from "../utils/jwt.utilis";
import ENV_CONFIG from "../config/env.config";
import { Role } from "../types/enum.types";


export const authenticate = () =>{
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
            const decode_data: any = verifyToken(access_token);
            
            if(!access_token){
                throw new AppError("Unauthorized. Access denied", 401);
            }
        } catch (error) {
            next(new AppError("Something went wrong", 500));
        }
    }
}