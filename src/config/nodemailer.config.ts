import nodemailer from "nodemailer";
import ENV_CONFIG from "./env.config";

//! transported

const transporter = nodemailer.createTransport({
    host: ENV_CONFIG.smtp_host,
    services: ENV_CONFIG.smtp_service,
    port: Number(ENV_CONFIG.smtp_port) ?? 587,
    secure: Number(ENV_CONFIG.smtp_port) === 465,
    auth: {
        user: ENV_CONFIG.smtp_user,
        pass: ENV_CONFIG.smtp_pass,
    },
});

export default transporter;