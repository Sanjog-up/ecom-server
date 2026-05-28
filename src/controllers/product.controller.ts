import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import  Product  from "../models/product.model";
import AppError from "../utils/appError.utils";
import Category from "../models/category.model";
import { deleteFileFromCloudinary, sendFileToCloudinary } from "../utils/cloudinary.utils";

const folders =  "/products";
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

export const create = catchAsync(async(req: Request, res: Response)=>{
  const {
    name, 
    desciption, 
    price, 
    category, 
    brand, 
    stock, 
    featured, 
    new_arrival
  } = req.body;

  //! files 
  const { image, cover_image } = req.files as 
  {
    [fieldname: string]: Express.Multer.File[];

  };
  if(!name || !price || !stock){
    throw new AppError("name, price and stock are required", 400);
  }
  if(!category || !brand){
    throw new AppError("category and brand are required", 400);
  }
  if(!cover_image[0]){
    throw new AppError("cover image is required", 400);
  }
  const product = new Product({
    name,
    stock,
    price,
    desciption,
    new_arrival,
    featured
  });

  const p_category = await Category.findOne({ _id: category});
  if(!p_category){
    throw new AppError(`Category not found`, 404);
  }
  const p_brand = await Brand.findOne({ _id: brand});
  if(!p_brand){
    throw new AppError(`Brand not found`, 404);
  }
  product.category = p_category._id;
  product.brand = p_brand._id;


  //todo images
  //* cover image
  const {path, public_id} = await sendFileToCloudinary(cover_image[0], folders );
  product.cover_image = {
    path,
    public_id,
  };

  //* images
  if(image && Array.isArray(image) && image.length > 0){
  const promises = image.map(
    async (file) => await sendFileToCloudinary(file, folders)
  );

  const files = await Promise.all(promises);

  product.images = files as any;
  } 

  //! save product 
  await product.save();

  sendResponse(res, {
    message: `Product created successfully`,
    statusCode: 201,
    data: product,  
  });
  })
// update
//  remove
export const remover = catchAsync(async(req:Request, res: Response)=>{
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  
  if(!product){
    throw new AppError(`Product ${id} not found`, 404);
  }

  await deleteFileFromCloudinary(product.cover_image.public_id);

  if(product.images){
    const promises = product.images.map(
     async( img: any )=> await deleteFileFromCloudinary(img.public_id),
  );
  await Promise.all(promises);
}
//! delete product 
  await product.deleteOne();

  //! send success response 
  sendResponse(res, {
    message: `product ${product._id} deleted`,
    statusCode: 200,
    data: null,
  })

// get by category

// get all featured products
// get all new arrivals