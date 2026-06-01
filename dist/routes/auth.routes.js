"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.multerUploader)();
//! create account 
router.post("/register", upload.single("profile_image"), auth_controller_1.register);
//! loging account
router.post("/login", auth_controller_1.login);
//! change profile image
router.put("/change-profile-image", upload.single("profile_image"), (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), auth_controller_1.changeProfilePitcure);
exports.default = router;
