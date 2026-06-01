"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const product_model_1 = __importDefault(require("../models/product.model"));
//! add to cart
exports.addToCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        throw new appError_utils_1.default("userId, productId and quantity are required", 400);
    }
    if (quantity <= 0) {
        throw new appError_utils_1.default("Quantity must be greater than zero", 400);
    }
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        throw new appError_utils_1.default(`Product with id ${productId} not found`, 404);
    }
    let cartItem = await cart_model_1.default.findOne({
        user: userId,
        items: { $elemMatch: { product: productId } },
    });
    if (cartItem) {
        cartItem.items.forEach((item) => {
            if (item.product.toString() === productId) {
                item.quantity += quantity;
            }
        });
    }
    else {
        cartItem = await cart_model_1.default.create({ user: userId, items: [] });
        cartItem.items.push({ product: productId, quantity });
    }
    await cartItem.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product added to cart",
        statusCode: 201,
        data: { cartItem },
    });
});
//! remove from cart
//! get cart
//! clear cart
