import { start } from "node:repl";
import type { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";

const getAllMedicine = async (search: (string), filerTags: string[], isStock: number, sellerID: string, manufacturer: string, currentPage: number, itemsPerPage: number, orderby: string) => {

    console.log("View All Medicine Query : ", search, filerTags, isStock, manufacturer, sellerID, currentPage, itemsPerPage, orderby);

    // Prisma planner below then query is executed

    const planner: MedicineWhereInput[] = []

    // Search Push for name and description
    if (search !== undefined && search !== "") {
        planner.push(
            {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                ]
            }
        )
    }

    // Tags filter if tags exist  
    if (filerTags.length > 0) {
        planner.push(
            {
                tags: {
                    hasEvery: filerTags
                }
            }
        )
    }
    // Stock Related planner is Available or not?
    if (isStock === 1) {
        planner.push(
            {
                stock: {
                    gt: 0
                }
            }
        )
    } else if (isStock === 0) {
        planner.push(
            {
                stock: {
                    lte: 0
                }
            }
        )
    }

    // Filter by seller ID 
    if (sellerID != "" && sellerID != undefined) {
        planner.push(
            {
                sellerID: {
                    equals: sellerID
                }
            }
        )
    }

    // Filter by manufacturer LTD
    if (manufacturer != "" && manufacturer != undefined) {
        planner.push(
            {
                manufacturer: {
                    equals: manufacturer
                }
            }
        )
    }

    console.log(planner);

    // Finally Prisma Caller 
    // Finally Prisma Caller 
    // Finally Prisma Caller 
    let start = Date.now();

    const results = await prisma.medicine.findMany({
        where: {
            AND: planner
        },
        skip: currentPage * itemsPerPage,
        take: itemsPerPage,
        orderBy: {
            name: orderby as 'asc' | 'desc',
        },
    })


    const metaPagination = await prisma.medicine.count({
        where: {
            AND: planner
        }
    });

    let end = Date.now();

    return {
        data: results,
        meta: {
            timeTaken: `${end - start} ms`,
            totalItem: metaPagination,
            currentPage: currentPage + 1,
            itemsPerPage: itemsPerPage,
            totalPages: Math.ceil(metaPagination / itemsPerPage)
        }
    };

    // Finally Prisma Caller end
    // Finally Prisma Caller end
    // Finally Prisma Caller end


}

const createMedicine = async (data: any, sellerID: string) => {
    data = { ...data, sellerID };

    // console.log(data);
    const start = Date.now();
    const result = await prisma.medicine.create({
        data,
    })
    const end = Date.now();

    return {
        data: result,
        meta: {
            timeTaken: `${end - start} ms`
        }
    };
};

const getMedicineByID = async (id: string) => {
    // console.log(id);

    let start = Date.now();
    const result = await prisma.medicine.findUnique({
        where: {
            id
        }
    })
    let end = Date.now();
    return {
        data: result,
        meta: {
            timeNow: end,
            timeTaken: `${end - start} ms`
        }
    };
}

const updateMedicine = async (id: string, data: any, sellerId: string) => {
    // check if valid 
    const medicine = await prisma.medicine.findUnique({
        where: {
            id
        }
    });

    if (!medicine) throw new Error("Medicine not found");
    if (medicine.sellerID !== sellerId) throw new Error("Unauthorized to update this medicine");
    //  update 
    const result = await prisma.medicine.update({
        where: {
            id
        },
        data: data
    });
    return result;
};

// Delete Medicine
const deleteMedicine = async (id: string, sellerId: string) => {
    const medicine = await prisma.medicine.findUnique({ where: { id } });

    if (!medicine) throw new Error("Medicine not found");
    if (medicine.sellerID !== sellerId) throw new Error("Unauthorized to delete this medicine");

    const result = await prisma.medicine.delete({
        where: { id }
    });
    return result;
};

export const medicineService = {
    createMedicine,
    getAllMedicine,
    getMedicineByID,
    updateMedicine,
    deleteMedicine
}