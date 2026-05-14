import express from "express";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();

//! create account 
router.post("/register", register);

//! loging account
router.post("/login", login); 


export default router;