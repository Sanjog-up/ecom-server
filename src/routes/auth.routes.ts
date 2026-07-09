import express from "express";
import { changeProfilePitcure, login, register, changePassword, getProfile, logout } from "../controllers/auth.controller";
import { multerUploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { All_Users } from "../types/enum.types";

const router = express.Router();

const upload = multerUploader();

//! create account 
router.post("/register", upload.single("profile_image"), register);

//! loging account
router.post("/login", login); 

//! change password
router.patch("/change-password", authenticate(All_Users), changePassword);

//! change profile image
router.put(
    "/change-profile-image", 
    upload.single("profile_image"),
    authenticate(All_Users),
    changeProfilePitcure,
);

router.get("/me", authenticate(All_Users), getProfile);
router.get("/logout", authenticate(All_Users), logout);

export default router;