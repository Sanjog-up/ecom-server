import jwt from "jsonwebtoken";
import { Role } from "../types/enum.types";
import mongoose  from "mongoose";
import ENV_CONFIG from "../config/env.config";

type TPayload = {
    _id: mongoose.Schema.Types.ObjectId;
    full_name?: string;
    role: Role;
    email: string;
};

//! generate access token

export const generateToken = (payload) => {
    try {
        const access_token = jwt.sign(payload, ENV_CONFIG.jwt_secret, {
            expiresIn: ENV_CONFIG.jwt_expiry as any,
        });
        return access_token;
    } catch (error) {
        console.log(error);
        throw error;
    }
}