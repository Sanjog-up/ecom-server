import express from "express";
import { getAll, getById } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Only_Admins } from "../types/enum.types";

const router = express.Router();

//! get all
router.get("/", authenticate(Only_Admins), getAll);

//! get by id
router.get("/:id",authenticate(Only_Admins),getById);

//! delete user

export default router;