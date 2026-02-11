import type { Request, Response } from "express";
import { userService } from "./user.service";
import { Role } from "../../generated/prisma/enums";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Expecting { role: "SELLER" } or "ADMIN"

        // Validate Role
        if (!Object.values(Role).includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const result = await userService.updateUserRole(id! as string, role);
        res.json({ success: true, message: "User role updated", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const userController = { getAllUsers, updateUserRole };