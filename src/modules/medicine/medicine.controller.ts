import type { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const createMedicine = async (req: Request, res: Response) => {
    try {
        const medicineData = req.body;
        // console.log(medicineData);
        const result = await medicineService.createMedicine(medicineData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


export const medicineController = {
    createMedicine,
}