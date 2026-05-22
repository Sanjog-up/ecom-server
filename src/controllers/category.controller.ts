import { NextFunction, Request, Response } from "express";
import  Category from "../models/category.model";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import { deleteFileFromCloudinary, sendFileToCloudinary } from "../utils/cloudinary.utils";
import cloudinary from "../config/cloudinary.config";

// cloudinary folder to upload image
const folder = "/categories";
//! get all
export const getAll = catchAsync(async (req:Request, res: Response, next: NextFunction) => {
   
    const { id } = req.params;

        const categories = await Category.findOne({_id: id});

        sendResponse(res, {
            message: "categories fetched",
            data: categories,
            statusCode: 200,
        });
    });

//! get by id
export const getById = catchAsync(async (req:Request, res: Response) => {

        const { id } = req.params;
        const category = await Category.findOne({_id: id});
        if(!category){
           throw new AppError(`category ${id} not found`, 400)
        }

     sendResponse(res, {
        message: `category ${id} fetched`,
        data:category,
        statusCode: 200,
     });
    });

//! create 
export const createCategory = catchAsync(async (req:Request, res: Response) => {

        const { name, description } = req.body;
        const image = req.file as Express.Multer.File;

        if(!name){
            throw new AppError("name is required", 400);
        }

        if(!image){
            throw new AppError("image is required", 400);
        }

        const category= new Category({ name, description });

        // todo: handle image
        //! upload image to cloud
        const { path, public_id } = await sendFileToCloudinary(image, folder);
        
        //! assign image to category 
        category.image = {
            path,
            public_id,
        }
        //? save category 
        await category.save();
        
        sendResponse(res, {
            message: "category created",
            data: category,
            statusCode: 201,
    });
    })


//! update
export const updateCategory = catchAsync( async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description } = req.body;
        const image = req.file as Express.Multer.File;

        const category = await Category.findOne({_id: id });
          if(!category){
           throw new AppError(`category ${id} not found`, 404)
        }

        if(name) category.name = name;
        if(description) category.description = description;
        if(image){
            const {path, public_id} = await sendFileToCloudinary(image, folder);
            await deleteFileFromCloudinary(category.image.public_id);
            category.image = {
                public_id,
                path
            };
        };
   
    //* save updated category to database
    await category.save(); 

    sendResponse(res,{
        message: `caregory ${id} updated`,
        data: category,
        statusCode: 200
    });
     });

//! delete 
export const deleteCategory = catchAsync(async(req: Request, res: Response) =>{        const { id }= req.params;

        const category = await Category.findOne({_id: id});

        if(!category){
            throw new AppError(`category ${id} not found`, 400);
        }

        await deleteFileFromCloudinary(category.image.public_id);

        await category.deleteOne();

        sendResponse
        (res,{
            message: `category ${id} deleted`,
            data: null,
            statusCode: 200,
        })
});