import express from "express";
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { All_Users } from "../types/enum.types";

const router = express.Router();

router.get("/", authenticate(All_Users), getCart);
router.post("/", authenticate(All_Users), addToCart);
router.patch("/:productId", authenticate(All_Users), updateCartItem);
router.delete("/:productId", authenticate(All_Users), removeFromCart);
router.delete("/", authenticate(All_Users), clearCart);

export default router;
