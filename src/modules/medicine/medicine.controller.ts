import type { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { skip } from "node:test";

// Get All Medicine with optional filters: search, tags, stock, sellerID, manufacturer & pagination (skip, take)
const getAllMedicine = async (req: Request, res: Response) => {
    let { search, tags, stock, sellerID, manufacturer, page, take, orderBy, category } = req.query;

    console.log(search, tags, stock, manufacturer, sellerID, page, take, orderBy);

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

    // Pagination calculation
    let currentPage = 0
    let itemsPerPage = 9
    if (parseInt(page as string) < 1 || parseInt(take as string) < 1) {
        skip
    } else {
        currentPage = (parseInt(page as string) - 1) || 0
        itemsPerPage = parseInt(take as string) || 9

    }

    // Check is orderby is valid or not, if not valid then set default to asc
    if (orderBy !== "asc" && orderBy !== "desc") {
        orderBy = "desc"
    }

    // console.log("Query Search is : ", req.query);
    try {
        const results = await medicineService.getAllMedicine(search as string, filterTags as string[], isStock as number, sellerID as string, manufacturer as string, currentPage, itemsPerPage, orderBy as string, category as string);
        res.status(201).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
// Create Medicine Related to Seller because only seller can create medicine
const createMedicine = async (req: Request, res: Response) => {
    try {
        // console.log(req.user);
        const medicineData = req.body;
        // console.log(medicineData);

        const result = await medicineService.createMedicine(medicineData, req.user!.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error for create medicine  ", error });
    }
}

const getMedicineByID = async (req: Request, res: Response) => {
    console.log(req.headers);
    try {
        const id = req.params.id;
        // debug log
        // console.log("ID", typeof (id), id);
        if (!id) return res.status(400).json({ message: "ID is required" });

        const result = await medicineService.getMedicineByID(id as string);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

const updateMedicine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await medicineService.updateMedicine(id as string, req.body, req.user!.id);
        res.json({
            success: true, data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
};

const deleteMedicine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await medicineService.deleteMedicine(id as string, req.user!.id, req.user!.roles);
        res.json({
            success: true, message: "Medicine deleted successfully"
        });
    } catch (error: any) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
};

// Don't forget to export these!

export const medicineController = {
    createMedicine,
    getAllMedicine,
    getMedicineByID,
    updateMedicine,
    deleteMedicine
}