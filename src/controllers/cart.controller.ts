import { catchAsync } from './../utils/catchAsync.utils';
import { Request, Response } from "express";
import Cart from "../models/cart.model";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import Product from "../models/product.model";

//! add to cart
// export const addToCart = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user._id;
//   const { productId, quantity } = req.body;

//   if (!productId || !quantity) {
//     throw new AppError("userId, productId and quantity are required", 400);
//   }

//   if (quantity <= 0) {
//     throw new AppError("Quantity must be greater than zero", 400);
//   }
//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new AppError(`Product with id ${productId} not found`, 404);
//   }

//   let cartItem = await Cart.findOne({
//     user: userId,
//     items: { $elemMatch: { product: productId } },
//   });

//   if (cartItem) {
//     cartItem.items.forEach((item) => {
//       if (item.product.toString() === productId) {
//         item.quantity += quantity;
//       }
//     });
//   } else {
//     cartItem = await Cart.create({ user: userId, items: [] });
//     cartItem.items.push({ product: productId, quantity });
//   }

//   await cartItem.save();

//   sendResponse(res, {
//     message: "Product added to cart",
//     statusCode: 201,
//     data: { cartItem },
    
//   });
// });
export const addToCart = catchAsync(async(req:Request, res:Response) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new AppError("productId and quantity are required", 400);
  }

  if (quantity <= 0) {
    throw new AppError("Quantity must be greater than zero", 400);
  }
  const product = await Product.findById(productId);
    if(!product){
      throw new AppError(`Product with id ${productId} not found`, 404)
    }
  
    let cart = await Cart.findOne({user:userId});
    if(!cart){
      cart = await Cart.create({
        user:userId,
        items: [{product: productId, quantity}],
      });
    }else{
      const existingItem = cart.items.find((item)=> item.product.toString() === productId);
      if(existingItem){
        existingItem.quantity += quantity;
      } else {
        cart.items.push({product:productId, quantity});
      }
      await cart.save();
    }
      sendResponse(res, {
        message: "Product added to cart",
        data: {cart},
        statusCode: 2001,
      })
})

//! get cart
export const getCart = catchAsync(async(req:Request, res:Response) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({user: userId}).populate("items.product")

  sendResponse(res,{
    message: "Cart fetched",
    statusCode: 200,
    data: {cart: cart ?? {user: userId, items:[]}},
  })

})

//! update quantity of cart items
export const updateCartItem = catchAsync(async(req:Request, res:Response)=> {
  const userId = req.user._id;
  const { productId} = req.params;
  const { quantity } = req.body;

  if(!quantity || quantity <= 0){
    throw new AppError("A valid quantity is required" , 400);
  }

  const cart = await Cart.findOne({ user: userId});
  if(!cart){
    throw new AppError("Cart not found", 400);
  }

  const item = cart.items.find((item) => item.product.toString() === productId);
  if(!item){
    throw new AppError("Product not found ", 404);
  }

  item.quantity = quantity;
  await cart.save();

  const populatedCart = await cart.populate("items.product");
  sendResponse(res, {
    message: " Cart item updated",
    statusCode: 200,
    data: {cart: populatedCart},
  })
})

//! remove from cart
export const removeFromCart = catchAsync(async(req:Request, res:Response)=> {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: userId})
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.pull({product: productId});
  await cart.save();

  const populatedCart = await cart.populate("items.product");

  sendResponse(res, {
    message: "Product removed from cart",
    statusCode: 200,
    data: { cart: populatedCart },
  });
}) 

//! clear cart
export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items.splice(0, cart.items.length);

  await cart.save();

  sendResponse(res, {
    message: "Cart cleared",
    statusCode: 200,
    data: { cart },
  });
});
