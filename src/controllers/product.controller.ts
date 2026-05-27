import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import  Product  from "../models/product.model";
import AppError from "../utils/appError.utils";

//* get all products
export const getAll = catchAsync(async(req: Request, res: Response)=>{
    const filter = {};

    const products = await Product.find(filter);

    sendResponse(res, {
        message: `Product fetched`,
        statusCode: 200,
        data: products,
    });
}); 

//* get by id 
 export const getById = catchAsync(async(req: Request, res: Response)=>{
    const { id } = req.params;

    const product = await Product.find({ _id: id});

      if (!product) {
    throw new AppError(`product ${id} not found `, 404);
  }
    sendResponse(res, {
        message: `Product ${id} fetched`,
        statusCode: 200,
        data: product,
    });
}); 

export const getByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const products = await Product.find({ category: categoryId });

  sendResponse(res, {
    message: `Product by category ${categoryId} fetched`,
    statusCode: 200,
    data: products,
  });
});
// create
// update
//  remove
// get by category
// get all featured products
// get all new arrivals