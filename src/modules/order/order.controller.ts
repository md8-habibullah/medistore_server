import type { Request, Response } from "express";
import { orderService } from "./order.service";

// Create a new order
const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { items } = req.body; // Expecting { items: [{ medicineId: "xv...", quantity: 2 }] }

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must contain at least one item" });
        }

        const result = await orderService.createOrder(userId, items);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: result
        });

    } catch (error: any) {
        console.error("Create Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to place order"
        });
    }
};

// Get logged-in user's order history
const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const result = await orderService.getMyOrders(userId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const orderController = {
    createOrder,
    getMyOrders
};