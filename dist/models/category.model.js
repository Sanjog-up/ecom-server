"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//! category schema
const categorySchema = new mongoose_1.default.Schema({
    // name: require, description
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "Category name must be 3 characters long"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        minLength: [24, "minimum 25 character is required"],
    },
    //todo: image 
    image: {
        type: {
            path: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            }
        },
        required: [true, "image is required"]
    }
}, { timestamps: true });
//! model
const Category = mongoose_1.default.model("category", categorySchema);
exports.default = Category;
