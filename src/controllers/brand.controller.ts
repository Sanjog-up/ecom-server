import { Request,Response } from "express";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { deleteFileFromCloudinary, sendFileToCloudinary } from "../utils/cloudinary.utils";
import Brand from "../models/brand.model";


const folder = "/brands";


//? create brand 
export const brand = catchAsync(async(req: Request, res:Response)=> {
    const { name, description } = req.body;
    const image = req.file;
    if(!image){
        throw new AppError("image is required", 400);
    }

    if(!name){
        throw new AppError("name is required", 400);
    }
    if(!description){
        throw new AppError("description is required", 400);
    }

    const brand = new Brand({ name, description });

    const existingBrand = await Brand.findOne({ name });
    if(existingBrand){
        throw new AppError("Brand already exists", 400);
    }

    // todo: handle image
    //! upload image to cloud
    const { path, public_id } = await sendFileToCloudinary(image, folder);
    
    //! assigin image to brand
    brand.image = {
        path,
        public_id,
    } 
    try{
    await brand.save();
    } catch (error){
        await deleteFileFromCloudinary(public_id);
        throw error;
    }

    sendResponse(res, {
        message: "brand created",
        data: brand,
        statusCode: 201,
    })
})

//! delete brand
export const deleteBrand = catchAsync(async(req: Request, res: Response) =>{        const { id }= req.params;

        const brand = await Brand.findOne({_id: id});

        if(!brand){
            throw new AppError(`brand ${id} not found`, 400);
        }

        await deleteFileFromCloudinary(brand.image.public_id);

        await brand.deleteOne();

        sendResponse
        (res,{
            message: `brand ${id} deleted`,
            data: null,
            statusCode: 200,
        })
}); 