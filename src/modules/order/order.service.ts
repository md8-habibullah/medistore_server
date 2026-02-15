import { prisma } from "../../../lib/prisma";
// import { Status } from "../../../generated/prisma/client"; // Import Status Enum

// 1. Create Order (Customer)
const createOrder = async (userId: string, items: { medicineId: string; quantity: number }[]) => {

    // Start a transaction (All or Nothing)
    return await prisma.$transaction(async (tx: any) => {
        let totalPrice = 0;

        // A. Calculate price and check stock for EACH item
        for (const item of items) {
            const medicine = await tx.medicine.findUnique({
                where: { id: item.medicineId }
            });

            if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);

            if (medicine.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${medicine.name}`);
            }

            totalPrice += medicine.price * item.quantity;

            // B. Reduce Stock immediately
            await tx.medicine.update({
                where: { id: item.medicineId },
                data: { stock: medicine.stock - item.quantity }
            });
        }

        // C. Create the Order
        const newOrder = await tx.order.create({
            data: {
                userId: userId,
                totalPrice: BigInt(totalPrice), // Schema uses BigInt
                status: "PENDING", // Default status
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

// 2. Get My Orders (Customer history)
const getMyOrders = async (userId: string) => {
    return await prisma.order.findMany({
        where: { userId },
        include: {
            orderItems: {
                include: { medicine: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Change signature to accept role
const getSellerOrders = async (userId: string, role: string) => {

    // If Admin, return ALL orders in the system
    if (role === "ADMIN") {
        return await prisma.order.findMany({
            include: {
                orderItems: { include: { medicine: true } },
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // If Seller, keep existing logic
    return await prisma.order.findMany({
        where: {
            orderItems: { some: { medicine: { sellerID: userId } } }
        },
        include: {
            orderItems: { include: { medicine: true } },
            user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

enum Status {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

// 4. Update Order Status (Seller/Admin)
const updateOrderStatus = async (orderId: string, status: Status) => {
    return await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status
        }
    });
};

export const orderService = {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus
};