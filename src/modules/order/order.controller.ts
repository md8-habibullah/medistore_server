import type { Request, Response } from "express";
import { orderService } from "./order.service";

// 1. Helper Helper to fix BigInt crash
const serializeBigInt = (data: any) => {
    return JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    ));
};

// Create a new order
const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { items } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must contain at least one item" });
        }

        const result = await orderService.createOrder(userId, items);

        const serializedResult = serializeBigInt(result);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: serializedResult
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

        const serializedResult = serializeBigInt(result);

        res.status(200).json({
            success: true,
            data: serializedResult
        });

    } catch (error: any) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user?.id;
        const result = await orderService.getSellerOrders(sellerId!, req.user?.roles || "CUSTOMER");

        const serializedResult = serializeBigInt(result);

        res.status(200).json({ success: true, data: serializedResult });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await orderService.updateOrderStatus(id! as string, status);

        const serializedResult = serializeBigInt(result);

        res.json({
            success: true, message: "Order status updated", data: serializedResult
        });
    } catch (error: any) {
        res.status(500).json({
            success: false, message: error.message
        });
    }
};

export const orderController = {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus
};