import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Cart from "../models/cart.model";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import Product from "../models/product.model";

//! add to cart
export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new AppError("userId, productId and quantity are required", 400);
  }

  if (quantity <= 0) {
    throw new AppError("Quantity must be greater than zero", 400);
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(`Product with id ${productId} not found`, 404);
  }

  let cartItem = await Cart.findOne({
    user: userId,
    items: { $elemMatch: { product: productId } },
  });

  if (cartItem) {
    cartItem.items.forEach((item) => {
      if (item.product.toString() === productId) {
        item.quantity += quantity;
      }
    });
  } else {
    cartItem = await Cart.create({ user: userId, items: [] });
    cartItem.items.push({ product: productId, quantity });
  }

  await cartItem.save();

  sendResponse(res, {
    message: "Product added to cart",
    statusCode: 201,
    data: { cartItem },
    
  });
});

//! remove from cart

//! get cart

//! clear cart
