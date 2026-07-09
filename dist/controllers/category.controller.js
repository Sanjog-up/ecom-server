"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getById = exports.getAll = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
// import cloudinary from "../config/cloudinary.config";
// cloudinary folder to upload image
const folder = "/categories";
//! get all
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const categories = await category_model_1.default.find();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "categories fetched",
        data: categories,
        statusCode: 200,
    });
});
//! get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category) {
        throw new appError_utils_1.default(`category ${id} not found`, 400);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `category ${id} fetched`,
        data: category,
        statusCode: 200,
    });
});
//! create 
exports.createCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const image = req.file;
    console.log("body:", req.body);
    console.log("file:", req.file);
    console.log("headers:", req.headers["content-type"]);
    if (!name) {
        throw new appError_utils_1.default("name is required", 400);
    }
    if (!image) {
        throw new appError_utils_1.default("image is required", 400);
    }
    const category = new category_model_1.default({ name, description });
    // todo: handle image
    //! upload image to cloud
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
    //! assign image to category 
    category.image = {
        path,
        public_id,
    };
    //? save category 
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "category created",
        data: category,
        statusCode: 201,
    });
});
//! update
exports.updateCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, categoryRef } = req.body;
    const image = req.file;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category) {
        throw new appError_utils_1.default(`category ${id} not found`, 404);
    }
    if (name)
        category.name = name;
    if (categoryRef)
        category.category = categoryRef;
    if (image) {
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(category.image.public_id);
        category.image = {
            public_id,
            path
        };
    }
    ;
    //* save updated category to database
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `category ${id} updated`,
        data: category,
        statusCode: 200
    });
});
//! delete 
exports.deleteCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category) {
        throw new appError_utils_1.default(`category ${id} not found`, 400);
    }
    await (0, cloudinary_utils_1.deleteFileFromCloudinary)(category.image.public_id);
    await category.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `category ${id} deleted`,
        data: null,
        statusCode: 200,
    });
});
