"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const brand_routes_1 = __importDefault(require("./brand.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/categories", category_routes_1.default);
router.use("/brands", brand_routes_1.default);
router.use("/products", products_routes_1.default);
exports.default = router;
