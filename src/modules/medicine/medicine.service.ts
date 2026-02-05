import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const getAllMedicine = async () => {
    console.log("View All Medicine");
    const results = prisma.medicine.findMany()
    return results;
}

const createMedicine = async (data: any, sellerID: string) => {
    data = { ...data, sellerID };

    console.log(data);

    const result = prisma.medicine.create({
        data,
    })
    return result;
};


export const medicineService = {
    createMedicine,
    getAllMedicine
}