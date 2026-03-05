import type { Request, Response } from "express";
import { userService } from "./user.service";
import { Roles } from "../../middlewire/authVerify";
import { auth } from "../../../lib/auth";
import { METHODS } from "node:http";
// import { Role } from "../../../generated/prisma/enums";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();
        res.json({
            success: true,
            data: result,
            devMessage: "This endpoint is protected. Only Admin can access this. So, if you are seeing this message, it means you have admin privileges."
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "You are not authorized to perform this action.",
            devMessage: "An error occurred while fetching users."
        });
    }
};

const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id, role } = req.body;

        // Validate Role
        if (!Object.values(Roles).includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
                devMessage: `Role must be one of: ${Object.values(Roles).join(", ")}`
            });
        }

        const result = await userService.updateUserRole(id, role);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Failed to update user role",
                devMessage: "User role update returned null or undefined."
            });
        }
        // await auth.api.revokeUserSessions({
        //     body: {
        //         userId: id,
        //     },
        // });

        res.json({
            success: true,
            data: result,
            message: "User role updated.\nUser can login with new role immediately after logout and login again.",
            devMessage: "This endpoint is protected. Only Admin can access this. So, if you are seeing this message, it means you have admin privileges."
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            devMessage: "An error occurred while updating user role."
        });
    }
};

const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                devMessage: "User ID not found in request. Please log in again."
            });
        }

        const result = await userService.getMyProfile(userId);

        res.status(200).json({
            success: true,
            data: result,
            message: "Profile fetched successfully.",
            devMessage: "This endpoint is protected. Only authenticated users can access this. So, if you are seeing this message, it means you are logged in and can see your profile."
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            devMessage: "An error occurred while fetching profile."
        });
    }
}
// all };owing to update in profile
const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const { name, image } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                devMessage: "User ID not found in request. Please log in again."
            });
        }

        const result = await userService.updateUserProfile(userId, { name, image });
        res.json({
            success: true,
            data: result,
            message: "Profile updated successfully.",
            devMessage: "This endpoint is protected. Only authenticated users can access this. So, if you are seeing this message, it means you are logged in and can update your profile."
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            devMessage: "An error occurred while updating profile."
        });
    }
};

export const userController = { getAllUsers, updateUserRole, getMyProfile, updateMyProfile };