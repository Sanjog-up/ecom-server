"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.createBrand = exports.updateBrand = exports.getById = exports.getAll = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const folder = "/brands";
//! get all
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const brands = await brand_model_1.default.find();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brands fetched",
        data: brands,
        statusCode: 200,
    });
});
//! get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default(`brand ${id} not found`, 400);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `brand ${id} fetched`,
        data: brand,
        statusCode: 200,
    });
});
//! update
exports.updateBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default(`brand ${id} not found`, 404);
    }
    if (name)
        brand.name = name;
    if (description)
        brand.description = description;
    if (name && name !== brand.name) {
        const duplicate = await brand_model_1.default.findOne({ name, _id: { $ne: id }
        });
        if (duplicate)
            throw new appError_utils_1.default("brand name already exists", 400);
    }
    if (image) {
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(brand.image.public_id);
        brand.image = {
            public_id,
            path
        };
    }
    ;
    //* save updated category to database
    await brand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `brand ${id} updated`,
        data: brand,
        statusCode: 200
    });
});
//? create brand 
exports.createBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const image = req.file;
    if (!image) {
        throw new appError_utils_1.default("image is required", 400);
    }
    if (!name) {
        throw new appError_utils_1.default("name is required", 400);
    }
    if (!description) {
        throw new appError_utils_1.default("description is required", 400);
    }
    const brand = new brand_model_1.default({ name, description });
    const existingBrand = await brand_model_1.default.findOne({ name });
    if (existingBrand) {
        throw new appError_utils_1.default("Brand already exists", 400);
    }
    // todo: handle image
    //! upload image to cloud
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
    //! assigin image to brand
    brand.image = {
        path,
        public_id,
    };
    try {
        await brand.save();
    }
    catch (error) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(public_id);
        throw error;
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand created",
        data: brand,
        statusCode: 201,
    });
});
//! delete brand
exports.deleteBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default(`brand ${id} not found`, 400);
    }
    await (0, cloudinary_utils_1.deleteFileFromCloudinary)(brand.image.public_id);
    await brand.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `brand ${id} deleted`,
        data: null,
        statusCode: 200,
    });
});
