"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearWishlist = exports.getWishlist = exports.addorremoveToWishlist = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const product_model_1 = __importDefault(require("../models/product.model"));
//! add/remove product from wishlist 
exports.addorremoveToWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;
    if (!userId || !productId) {
        throw new appError_utils_1.default("userId and productId are required", 400);
    }
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        throw new appError_utils_1.default(`Product with id ${productId} not found`, 404);
    }
    const existingEntry = await wishlist_model_1.default.findOne({ user: userId, productId: productId });
    // Product already in wishlist, remove it
    if (existingEntry) {
        await existingEntry.deleteOne();
        (0, sendResponse_utils_1.sendResponse)(res, {
            message: 'Product removed from wishlist',
            statusCode: 200,
            data: { wishlisted: false, productId }
        });
        return;
    }
    const wishlistItem = await wishlist_model_1.default.create({ user: userId, productId });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Product added to wishlist',
        statusCode: 201,
        data: { wishlisted: true, productId, wishlistItemId: wishlistItem._id }
    });
});
//! get wishlist
exports.getWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new appError_utils_1.default("userId is required", 400);
    }
    const wishlistItems = (await wishlist_model_1.default.find({ user: userId }).populate('productId').sort({ createdAt: -1 }));
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Wishlist fetched',
        statusCode: 200,
        data: { wishListCount: wishlistItems.length, wishlist: wishlistItems }
    });
});
//! clear wishlist 
exports.clearWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new appError_utils_1.default("userId is required", 400);
    }
    await wishlist_model_1.default.deleteMany({ user: userId });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Wishlist cleared',
        statusCode: 200,
        data: null
    });
});
