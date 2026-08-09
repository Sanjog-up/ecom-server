import { NextFunction, Request, Response} from "express";
import User from "../models/user.model";

export const getAll = async (req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
  const filter = {};

//  * get all users query
const users = await User.find(filter);

//* success response
res.status(200).json({
    message: "All users fetched",
    data: users,
    success: true,
    status: "success"
}); 
    }catch (error: any){
        next({
            message: error?.message || "Something went wrong",
            status: "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        })
    }
}

//! get by id

export const getById = async(req: Request, 
    res: Response,
    next: NextFunction,
) => {
    try{
        //* user id
        const { id } = req.params;
        
        //* db query
        const user = await User.findOne({ _id: id});
        
        //* if user not found 
        if(!user){
        const error: any = new Error("User not found");
        error.statusCode = 404;
        error.status = "fail";
        throw error;
    }
    
    //* success response
    res.status(200).json({
        message: `User ${id} fetched`,
        data: user,
        succedd: true,
        status: "success"
    }); 
}
    catch (error: any){
        next({
            message: error?.message || "Something went wrong",
            status: error?.status || "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        })
    }
}

export const deleteUser = async(req: Request, res: Response, next: NextFunction)=> {
    try {
        //* user id 
        const { id } = req.params;

        //* db query
        const user = await User.findOne({ _id: id});
        //* if user not found 
        if(!user){
        const error: any = new Error("User not found");
        error.statusCode = 404;
        error.status = "fail";
        throw error;}
        await user.deleteOne();
        //* success response
        res.status(200).json({
            message: `User ${id} deleted`,
            data: user,
        succedd: true,
        status: "success"
        });
    } catch (error:any) {
        next({
            message: error?.message || "Something went wrong",
            status: error?.status || "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        })
    }
}