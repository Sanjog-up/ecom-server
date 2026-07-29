import { Router } from "express";
import { addorremoveToWishlist, getWishlist, clearWishlist }   from "../controllers/wishlist.controller";
import express from 'express';
import { authenticate } from "../middlewares/auth.middleware";
import { All_Users } from "../types/enum.types";

const router = express.Router();

router.get("/", authenticate(All_Users), getWishlist);
router.patch("/:productId",authenticate(All_Users), addorremoveToWishlist);
router.delete("/",authenticate(All_Users), clearWishlist);

export default router;