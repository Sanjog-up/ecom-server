import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.utils";

export const errorHandler = (error: any,
     req:Request,
    res: Response,
    next: NextFunction,
)=> {
    let message = error?.message || "Internal server error";
    let statusCode = error?.statusCode || 500;
    let status = error?.status || "error";

    console.log(error.name);
    console.log(error.message);

    // //! 
    // if(error instanceof AppError)
    //     message = error.message;

    //! validation error
    if(error.name === "ValidationError"){
        console.log();
        message = Object.values(error.errors)
        .map((err:any)=> err.message)
        .join(",");
        statusCode = 422;
        status = "fail";
    }
     
    //! mongoose error
    if( error.name === "MongooseError"){
        message = error.message;
        statusCode = 400;
        status = "fail";
    } 
    
    //! bad objectId or get/products/not-an-id 
    if(error.name === "CastError"){
        message= `Invalid ${error.path}: ${error.value}`;
        statusCode = 400;
        status = "fail";
    }
    //! duplicate key or registering with an existing email 
    if(error.name === 11000){
        const field = Object.keys(error.keyValue)[0];
        message= `${field} already exists`;
        statusCode = 409;
        status = "fail";
    }

    //*  error response
    res.status(statusCode).json({
        message,
        status,
        success: false,
        data: null,
    })
}