import type { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const getAllMedicine = async (req: Request, res: Response) => {
    try {
        const results = await medicineService.getAllMedicine()
        res.status(201).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

const createMedicine = async (req: Request, res: Response) => {
    try {
        // console.log(req.user);
        const medicineData = req.body;
        // console.log(medicineData);

        const result = await medicineService.createMedicine(medicineData, req.user!.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


export const medicineController = {
    createMedicine,
    getAllMedicine
}