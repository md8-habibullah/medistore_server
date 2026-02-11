import type { Request, Response } from "express";
import { reviewService } from "./review.service";

const addReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { medicineId, rating, comment } = req.body;

        const result = await reviewService.addReview(userId!, medicineId, rating, comment);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getMedicineReviews = async (req: Request, res: Response) => {
    try {
        const { medicineId } = req.params;
        const result = await reviewService.getMedicineReviews(medicineId! as string);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const reviewController = { addReview, getMedicineReviews };