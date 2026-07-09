"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.multerUploader)();
//? get all 
router.get("/", category_controller_1.getAll);
//? get by id  
router.get("/:id", category_controller_1.getById);
//? create category 
router.post("/", (0, auth_middleware_1.authenticate)(enum_types_1.Only_Admins), upload.single("image"), category_controller_1.createCategory);
//? update category 
router.patch("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.Only_Admins), upload.single("image"), category_controller_1.updateCategory);
//? delete  
router.delete("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.Only_Admins), category_controller_1.deleteCategory);
exports.default = router;
