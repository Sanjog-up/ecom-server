"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = __importDefault(require("./env.config"));
//! transported
const transporter = nodemailer_1.default.createTransport({
    // host: ENV_CONFIG.smtp_host,
    // service: ENV_CONFIG.smtp_service,
    service: 'gmail',
    port: Number(env_config_1.default.smtp_port) || 587,
    secure: Number(env_config_1.default.smtp_port) === 465,
    auth: {
        user: env_config_1.default.smtp_user,
        pass: env_config_1.default.smtp_pass,
    },
});
exports.default = transporter;
