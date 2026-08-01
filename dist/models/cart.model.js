"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//! cart schema
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "product",
                required: [true, "Product is required"],
            },
            quantity: {
                type: Number,
                default: 1,
                min: [1, "Quantity must be at least 1"],
            },
        },
    ],
}, { timestamps: true });
//! Cart model
const cart = mongoose_1.default.model("Cart", cartSchema);
exports.default = cart;
