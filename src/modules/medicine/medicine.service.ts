import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

const createMedicine = async (data: any) => {
    console.log(data);
    const result = prisma.medicine.create({
        data,
    })
    return result;
};


export const medicineService = {
    createMedicine,
}