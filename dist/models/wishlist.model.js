"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//! wishlist schema
const wishlistSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product ID is required"]
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    }
}, { timestamps: true });
//! Wishlist model
const wishList = mongoose_1.default.model("Wishlist", wishlistSchema);
exports.default = wishList;
