"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getProfile = exports.changePassword = exports.changeProfilePitcure = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const bcrypt_utilis_1 = require("../utils/bcrypt.utilis");
const jwt_utilis_1 = require("../utils/jwt.utilis");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmail_utils_1 = require("../utils/sendEmail.utils");
const email_utils_1 = require("../utils/email.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const folder = "/profile_image";
//! register
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { full_name, email, password, phone, role } = req.body;
    const image = req.file;
    console.log(image);
    if (!full_name) {
        throw new appError_utils_1.default("full_name is required", 404);
    }
    if (!email) {
        throw new appError_utils_1.default("email is required", 404);
    }
    if (!password) {
        throw new appError_utils_1.default("password is required", 404);
    }
    //* create User instance
    const user = new user_model_1.default({ full_name, email, password, phone, role });
    //* hash password
    const hash = await (0, bcrypt_utilis_1.hashPassword)(password);
    user.password = hash;
    //! handle profile image
    if (image) {
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        user.profile_image = {
            path,
            public_id,
        };
    }
    //* save user
    await user.save();
    //* generate access token -> jwt
    const token = jsonwebtoken_1.default.sign({
        _id: user._id,
        role: user.role,
        email: user.email,
        full_name: user.full_name,
    }, env_config_1.default.jwt_secret, { expiresIn: "7d" });
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Account created",
        data: { user, token },
        statusCode: 201,
    });
});
//! login
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    console.log("login");
    //* login
    //* email password <- req.body
    const { email, password } = req.body;
    if (!email) {
        //   const error: any = new Error("email is required");
        //   error.statusCode = 404;
        //   error.status = "fail";
        //   throw error;
        throw new appError_utils_1.default("email is required", 404);
    }
    if (!password) {
        // const error: any = new Error("password is required");
        // error.statusCode = 404;
        // error.status = "fail";
        // throw error;
        throw new appError_utils_1.default("password is required", 404);
    }
    // * find user by email
    const user = await user_model_1.default.findOne({ email: email });
    if (!user) {
        throw new appError_utils_1.default("email or password does not matched", 400);
    }
    // * compare password
    //const isPasswordMatched = PASSWORD ==== USER.PASSWORD;
    const isPasswordMathed = await (0, bcrypt_utilis_1.comparePassword)(password, user.password);
    if (!isPasswordMathed) {
        throw new appError_utils_1.default("email or password does not match", 400);
    }
    // todo: generate access token -> jwt
    const payload = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwt_utilis_1.generateJwtToken)(payload);
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: `Welcome ${user.full_name}`,
        html: (0, email_utils_1.generateLoginSuccessEmailHtml)(req, {
            full_name: user.full_name,
            _id: user._id,
            email: user.email,
        }),
    });
    //* send access_token in cookie
    res.cookie("access_token", access_token, {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        maxAge: parseInt(env_config_1.default.cookie_express ?? "7") * 24 * 60 * 60 * 1000,
        secure: env_config_1.default.node_env === "development" ? false : true,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
    });
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login successful",
        data: { user, access_token },
        statusCode: 201,
    });
});
//! update profile
exports.changeProfilePitcure = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const image = req.file;
    const id = req.user?._id;
    if (!image) {
        throw new appError_utils_1.default("profile image required", 400);
    }
    //! find user
    const user = await user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new appError_utils_1.default("user account not found", 400);
    }
    //! upload image to cloud
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
    //! delete old image
    if (user?.profile_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(user.profile_image.public_id);
    }
    //! assignn new image to user
    user.profile_image = {
        path,
        public_id,
    };
    //! save user
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "profile image updated",
        data: user,
        statusCode: 200,
    });
});
//! change password
exports.changePassword = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const id = req.user?._id;
    const { old_password, new_password, confirm_password } = req.body;
    if (!old_password || !new_password || !confirm_password) {
        throw new appError_utils_1.default("all fields are required", 400);
    }
    if (new_password !== confirm_password) {
        throw new appError_utils_1.default("new password and confirm password does not match", 400);
    }
    //! find user
    const user = await user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new appError_utils_1.default("user account not found", 400);
    }
    //! compare old password
    const isPasswordMatched = await (0, bcrypt_utilis_1.comparePassword)(old_password, user.password);
    if (!isPasswordMatched) {
        throw new appError_utils_1.default("old password is incorrect", 400);
    }
    //! hash new password
    const hash = await (0, bcrypt_utilis_1.hashPassword)(new_password);
    user.password = hash;
    //! save user
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "password changed successfully",
        data: null,
        statusCode: 200,
    });
});
//! handle profile image
exports.getProfile = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const user = await user_model_1.default.findOne({
        _id: req?.user?._id,
        email: req?.user?.email,
    });
    if (!user) {
        throw new appError_utils_1.default("user account not found", 400);
    }
    //! send response 
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "profile fetched",
        data: user,
        statusCode: 200,
    });
});
//* logout
exports.logout = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        maxAge: Date.now(),
        secure: env_config_1.default.node_env === "development" ? false : true,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
        path: "/",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Logged out successfully",
        statusCode: 200,
        data: null,
    });
});
//! change passowrd 
