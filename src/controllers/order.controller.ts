import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import Order from "../models/orders.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import {
  initiateKhaltiPayment,
  lookupKhaltiPayment,
} from "../service/khalti.service";
import ENV_CONFIG from "../config/env.config";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    throw new AppError("Shipping address and payment method are required", 400);
  }

  if (!["COD", "Khalti"].includes(paymentMethod)) {
    throw new AppError("Invalid payment method", 400);
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const items = cart.items.map((item: any) => {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Product ${item.product.name} is out of stock`, 400);
    }
    return {
      product: item.product._id,
      name: item.product.name,
      cover_image: item.product.cover_image,
      quantity: item.quantity,
      price: item.product.price,
    };
  });

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const order = new Order({
    user: userId,
    items,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  if (paymentMethod === "COD") {
    await decrementStock(items);
    cart.items.splice(0, cart.items.length);
    await cart.save();

    return sendResponse(res, {
      statusCode: 201,
      message: "Order created successfully(Cash on Delivery)",
      data: { order },
    });
  }

  //! khalti payment
  const payment = await initiateKhaltiPayment({
    amount: Math.round(totalPrice * 100), // amount in paisa
    purchase_order_id: order._id.toString(),
    purchase_order_name: `Order-${order._id}`,
    return_url: `${ENV_CONFIG.frontend_url}/checkout/verify`,
  });

  order.khaltiPidx = payment.pidx;
  await order.save();

  sendResponse(res, {
    statusCode: 201,
    message: "Order created successfully(Khalti Payment)",
    data: {
      paymentUrl: payment.payment_url,
      orderId: order._id,
    },
  });
});

//! verify khalti payment
export const verifyKhaltiPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { pidx } = req.body;
    if (!pidx) {
      throw new AppError("Payment ID is required", 400);
    }

    const order = await Order.findOne({ khaltiPidx: pidx });
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const result = await lookupKhaltiPayment(pidx);

    if (result.status !== "Completed") {
      order.paymentStatus = "Failed";
      await order.save();
      throw new AppError(`Payment ${result.status.toLowerCase()}`, 400);
    }

    order.paymentStatus = "Paid";
    await order.save();

    await decrementStock(order.items);
    await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });

    sendResponse(res, {
      statusCode: 200,
      message: "Payment verified and order completed successfully",
      data: { order },
    });
  },
);

//! get logged in users order
export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  
    sendResponse(res, {
        message: "User orders fetched successfully",
        statusCode: 200,
        data: { orders },
    });
});

//! get order by id 
export const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = ["Admin", "Super_admin"].includes(req.user.role);
    if (!isOwner && !isAdmin) {
        throw new AppError("You are not authorized to view this order", 403);
    }

    sendResponse(res, {
        message: "Order fetched successfully",
        statusCode: 200,
        data: { order },
    });
});

//! admin update orders
export const updateOrderStatus = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        
        
        const allwed = ["pending", "shipped", "delivered", "cancelled"];
        if (!allwed.includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            throw new AppError("Order not found", 404);
        }

        sendResponse(res, {
            message: "Order status updated successfully",
            statusCode: 200,
            data: { order },
        });
    },
);

//! decrement stock
const decrementStock = async (items: any[]) => {
    await Promise.all(
        items.map((item) =>
            Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            }),
        ),
    );
};