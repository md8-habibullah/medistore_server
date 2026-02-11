import { Router } from "express";
import { orderController } from "./order.controller";
import { authVerify, Roles } from "../../middlewire/authVerify";

const router = Router();

// Customer creates an order
router.post("/", authVerify(Roles.CUSTOMER), orderController.createOrder);

// User sees THEIR own orders
router.get("/my-orders", authVerify(Roles.CUSTOMER, Roles.SELLER), orderController.getMyOrders);

export const orderRouter: Router = router;