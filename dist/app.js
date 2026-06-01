"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_middlewares_1 = require("./middlewares/errorHandler.middlewares");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//! importing routes
const routes_1 = __importDefault(require("./routes"));
const appError_utils_1 = __importDefault(require("./utils/appError.utils"));
//! creating express app instance
const app = (0, express_1.default)();
//! using middlewares
//* cookie parser
app.use((0, cookie_parser_1.default)());
//! body parser
app.use(express_1.default.json({ limit: "10mb" }));
//! helth route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is up and running",
        success: true,
        status: "success",
    });
});
//! using routes
app.use("/api/v1", routes_1.default);
//! path not found error middleware
app.use((req, res, next) => {
    const message = `can not ${req.method} on ${req.url}`;
    throw new appError_utils_1.default(message, 404);
});
//! error handler
app.use(errorHandler_middlewares_1.errorHandler);
exports.default = app;
