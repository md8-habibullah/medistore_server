import type { Request, Response } from "express";
import { orderService } from "./order.service";
import e from "express";
import { JSONStringify } from "json-with-bigint";

// Helper Helper to fix BigInt 
// const serializeBigInt = (data: any) => {
//     return JSON.parse(JSON.stringify(data, (key, value) =>
//         typeof value === 'bigint'
//             ? value.toString()
//             : value
//     ));
// };

// Create a new order
const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { items } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
                devMessage: "User ID is missing in the request. Ensure that the authentication middleware is properly setting req.user."
            });
        }

        if (!items || !Array.isArray(items) || items.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item",
                devMessage: "The 'items' field is required and must be a non-empty array. Ensure that the client is sending the correct payload."
            });
        }
        // Important Line here - Call the service layer to create the order
        const result = await orderService.createOrder(userId, items);

        // console.log("RESULT FROM ME", result);

        // const serializedResult = serializeBigInt(result);

        // res.status(201).json({
        //     success: true,
        //     message: "Order placed successfully",
        //     devMessage: "Order created successfully for user: " + userId,
        //     data: serializedResult
        // });
        res.status(201).send(JSONStringify({
            success: true,
            data: result
        }));

    } catch (error: any) {
        console.error("Create Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to place order",
        });
    }
};

// Get logged-in user's order history
const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
                devMessage: "User ID is missing in the request. Ensure that the authentication middleware is properly setting req.user."
            });
        }

        const result = await orderService.getMyOrders(userId);
        // console.log("controller", result);

        // const serializedResult = serializeBigInt(result);

        // res.status(200).json({
        //     success: true,
        //     message: "Orders retrieved successfully",
        //     devMessage: "Order history retrieved for user: " + userId,
        //     // data: serializedResult
        //     data: result
        // });

        res.status(200).send(JSONStringify({
            success: true,
            data: result
        }));


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve orders",
            devMessage: "Failed to retrieve orders. Ensure that the database connection is healthy and the query is correct."
        });
    }
};

const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user?.id;
        const result = await orderService.getSellerOrders(sellerId!, req.user?.roles || "CUSTOMER");

        // const serializedResult = serializeBigInt(result);

        // res.status(200).json({
        //     success: true,
        //     data: serializedResult
        // });

        res.status(200).send(JSONStringify({
            success: true,
            data: result
        }));
    } catch (error: any) {
        res.status(500).json({
            success: false, message: error.message || "Failed to retrieve seller orders",
            devMessage: "Ensure that the user is authenticated and has the correct role. Also check database connectivity and query correctness."
        });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await orderService.updateOrderStatus(id! as string, status);

        // const serializedResult = serializeBigInt(result);

        // res.json({
        //     success: true,
        //     message: "Order status updated",
        //     devMessage: `Order ${id} status updated to ${status}`,
        //     // data: serializedResult
        //     data: result
        // });
        res.status(200).send(JSONStringify({
            success: true,
            data: result
        }));
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            devMessage: "Failed to update order status. Ensure that the order ID is correct and the status value is valid."
        });
    }
};

export const orderController = {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus
};