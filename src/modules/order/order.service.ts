import { prisma } from "../../../lib/prisma";

const createOrder = async (userId: string, items: { medicineId: string; quantity: number }[]) => {

    // Start a transaction (All or Nothing)
    return await prisma.$transaction(async (tx) => {
        let totalPrice = 0;

        // 1. Calculate price and check stock for EACH item
        for (const item of items) {
            const medicine = await tx.medicine.findUnique({
                where: { id: item.medicineId }
            });

            if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
            if (medicine.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${medicine.name}`);
            }

            totalPrice += medicine.price * item.quantity;

            // 2. Reduce Stock immediately
            await tx.medicine.update({
                where: { id: item.medicineId },
                data: { stock: medicine.stock - item.quantity }
            });
        }

        // 3. Create the Order
        const newOrder = await tx.order.create({
            data: {
                userId: userId,
                totalPrice: BigInt(totalPrice), // Schema uses BigInt
                status: "PENDING",
                orderItems: {
                    create: items.map(item => ({
                        medicineId: item.medicineId,
                        quantity: item.quantity,
                        price: 0 // Ideally fetch current price again or pass it down
                    }))
                }
            },
            include: { orderItems: true } // Return the items with the order
        });

        return newOrder;
    });
};

const getMyOrders = async (userId: string) => {
    return await prisma.order.findMany({
        where: { userId },
        include: { orderItems: { include: { medicine: true } } }, // Show medicine details in history
        orderBy: { createdAt: 'desc' }
    });
};

export const orderService = { createOrder, getMyOrders };