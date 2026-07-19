"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_config_1 = __importDefault(require("./config/db.config"));
const env_config_1 = __importDefault(require("./config/env.config"));
const PORT = process.env.PORT;
(0, db_config_1.default)(env_config_1.default.db_uri)
    .then(() => {
    //! listening on port
    app_1.default.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.log(`Failed to connect to databse, existing:`, err);
});
