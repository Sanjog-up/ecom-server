import { Request, Response } from 'express';
import {catchAsync} from '../utils/catchAsync.utils';
import wishlist from '../models/wishlist.model';
import { sendResponse } from '../utils/sendResponse.utils';
import AppError from '../utils/appError.utils';
import Product from '../models/product.model';

//! add/remove product from wishlist 
export const addorremoveToWishlist = catchAsync(async(req: Request, res: Response) => {
    const userId = req.user._id;
    const { productId } = req.params as {productId: string};

    if(!userId || !productId){
        throw new AppError("userId and productId are required", 400);
    }
    
    const product = await Product.findById(productId);
    if(!product){
        throw new AppError(`Product with id ${productId} not found`, 404);
    }
    const existingEntry = await wishlist.findOne({ user: userId, productId: productId });
     // Product already in wishlist, remove it
    if (existingEntry) {
        await existingEntry.deleteOne();

        sendResponse(res, {
            message: 'Product removed from wishlist',
            statusCode: 200,
            data: { wishlisted: false, productId }
        })
        return;
    }
    const wishlistItem = await wishlist.create({ user: userId, productId });

    sendResponse(res, {
        message: 'Product added to wishlist',
        statusCode: 201,
        data: { wishlisted: true, productId, wishlistItemId: wishlistItem._id }
    });
    
    });

//! get wishlist
export const getWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;

    if (!userId) {
        throw new AppError("userId is required", 400);
    }

    const wishlistItems = (await wishlist.find({ user: userId }).populate('productId').sort({ createdAt: -1 }));
    
    sendResponse(res, {
        message: 'Wishlist fetched',
        statusCode: 200,
        data: { wishListCount: wishlistItems.length, wishlist: wishlistItems }
    });
});

//! clear wishlist 
export const clearWishlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;

    if (!userId) {
        throw new AppError("userId is required", 400);
    }

    await wishlist.deleteMany({ user: userId });

    sendResponse(res, {
        message: 'Wishlist cleared',
        statusCode: 200,
        data: null
    });
});