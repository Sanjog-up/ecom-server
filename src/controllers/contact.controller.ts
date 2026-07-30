import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import ENV_CONFIG from "../config/env.config";
import { sendEmail } from "../utils/sendEmail.utils";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendContactMessage = catchAsync(async(req: Request, res:Response) => {
    const { name, email, message } = req.body;
    if(!name) throw new AppError("name is required", 400);
    if(!email || !emailRegex.test(email)) throw new AppError("a valid email is required", 400);
    if(!message) throw new AppError("message is required", 400);

    sendEmail({
        to: ENV_CONFIG.smtp_user,
        subject: `New contact message from ${name}`,
        html: `
        <h3>New Contact Form submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        `,
    });

    sendResponse(res, {
        message: "message sent successfully",
        data: null,
        statusCode: 200
    })
}) 