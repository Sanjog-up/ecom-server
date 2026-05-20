import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes"; 

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);

export default router;
