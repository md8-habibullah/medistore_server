import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                medicines: {
                    take: 1
                }
            }
        });
        res.json({
            success: true,
            data: categories
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

export const categoryController = { getAllCategories };
