"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_config_1 = __importDefault(require("./config/db.config"));
const DB_URI = "mongodb://localhost/team_12";
const PORT = 8080;
(0, db_config_1.default)(DB_URI);
//! listening on port
app_1.default.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
