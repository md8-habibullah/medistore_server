import type { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";

const getAllMedicine = async (search: (string), filerTags: string[], isStock: number, sellerID: string, manufacturer: string, currentPage: number, itemsPerPage: number) => {

    console.log("View All Medicine", search, filerTags, isStock, manufacturer, sellerID, currentPage, itemsPerPage);

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

    const results = await prisma.medicine.findMany({
        where: {
            AND: planner
        },
        skip: currentPage * itemsPerPage,
        take: itemsPerPage
    })
    return results;

    // Finally Prisma Caller end
    // Finally Prisma Caller end
    // Finally Prisma Caller end


}

const createMedicine = async (data: any, sellerID: string) => {
    data = { ...data, sellerID };

    console.log(data);

    const result = await prisma.medicine.create({
        data,
    })
    return result;
};


export const medicineService = {
    createMedicine,
    getAllMedicine
}