import { prisma } from "../../../lib/prisma";

const addReview = async (userId: string, medicineId: string, rating: number, comment: string) => {
    // Check if user actually bought the medicine (Optional but good for marks)
    const hasPurchased = await prisma.order.findFirst({
        where: {
            userId,
            status: "DELIVERED", // Only allow if delivered
            orderItems: { some: { medicineId } }
        }
    });

    if (!hasPurchased) {
        throw new Error("You can only review medicines you have purchased and received.");
    }

    return await prisma.review.create({
        data: {
            userId,
            medicineId,
            rating,
            comment
        }
    });
};

const getMedicineReviews = async (medicineId: string) => {
    return await prisma.review.findMany({
        where: { medicineId },
        include: {
            user: {
                select: { name: true, image: true } // Show reviewer name/image
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const reviewService = { addReview, getMedicineReviews };