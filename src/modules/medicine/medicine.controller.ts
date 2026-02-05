import type { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const getAllMedicine = async (req: Request, res: Response) => {
    let { search, tags, stock, sellerID, manufacturer } = req.query;

    console.log(search, tags, stock, manufacturer, sellerID);

    // Split tags from comma-separated string to array
    let filterTags = typeof tags === "string" ? tags.split(",") : []

    // Convert isStock to number (1 for true, 0 for false); because schema is integer
    let isStock = undefined;
    // if come boolean or string true false 
    if (stock === "true") {
        isStock = 1
        // console.log(true);
    } else if (stock === "false") {
        isStock = 0
        // console.log(false);
    } else {
        isStock = -1
        // console.log(undefined);
    }

    // console.log("Query Search is : ", req.query);
    try {
        const results = await medicineService.getAllMedicine(search as string, filterTags as string[], isStock as number, sellerID as string, manufacturer as string);
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