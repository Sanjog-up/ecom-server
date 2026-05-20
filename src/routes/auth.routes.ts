import express from "express";
import { login, register } from "../controllers/auth.controller";
import { multerUploader } from "../middlewares/multer.middleware";

const router = express.Router();

const upload = multerUploader();

//! create account 
router.post("/register", upload.single("profile_image"), register);

//! loging account
router.post("/login", login); 


export default router;