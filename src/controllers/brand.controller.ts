import { Request,Response } from "express";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";


//? create brand 
export const brand = catchAsync(async(req: Request, res:Response)=> {
    const { name, description } = req.body;

    if(!name){
        throw new AppError("name is required", 400);
    }
    if(!description){
        throw new AppError("description is required", 400);
    }

    const existingBrand = await Brand.find({ name });
    if(existingBrand){
        throw new AppError("Brand already exists", 400);
    }
})