import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes"; 
import brandRoutes from "./brand.routes";
import productsRoutes from "./products.routes";
import cartRoutes from "./cart.routes";
import wishListRoues from "../routes/wishlist.routes";
import contactRoutes from "./contact.routes";
import orderRoutes from "./order.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishListRoues);
router.use("/contact", contactRoutes);
router.use("/orders", orderRoutes);

export default router;