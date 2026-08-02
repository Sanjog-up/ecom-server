import { authenticate } from './../middlewares/auth.middleware';
import express from 'express';
import { createOrder, verifyKhaltiPayment, getMyOrders, getOrderById, updateOrderStatus, } from '../controllers/order.controller';
import { All_Users,Only_Admins  } from '../types/enum.types';

const router = express.Router();

router.post("/", authenticate([All_Users]), createOrder);
router.post("/verify-khalti", authenticate([All_Users]), verifyKhaltiPayment);
router.get("/my-orders", authenticate([All_Users]), getMyOrders);
router.get("/:id", authenticate([All_Users]), getOrderById);
router.patch("/:id/status", authenticate([Only_Admins]), updateOrderStatus);

export default router;