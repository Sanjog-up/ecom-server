"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = express_1.default.Router();
//? get all
router.get("/", brand_controller_1.getAll);
//? get by id 
router.get("/:id", brand_controller_1.getById);
//? create brand
const upload = (0, multer_middleware_1.multerUploader)();
router.post("/", upload.single("brand_logo"), brand_controller_1.createBrand);
//? update brand
router.patch("/:id", upload.single("brand_logo"), brand_controller_1.updateBrand);
//? delete
router.delete("/:id", brand_controller_1.deleteBrand);
exports.default = router;
