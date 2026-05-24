import { NextFunction } from "express"
import AppError from "../utils/appError.utils"



export const authenticate = () =>{
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            next(new AppError("Something went wrong", 500));
        }
    }
}