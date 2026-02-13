import type { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";


const getAllUsers = async () => {
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true, name: true, email: true, role: true, createdAt: true, emailVerified: true
        }
    });
};

const updateUserProfile = async (userId: string, data: { name?: string, image?: string }) => {
    return await prisma.user.update({
        where: { id: userId },
        data
    });
};

const updateUserRole = async (userId: string, role: Role, email?: string, phone?: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { role }
    });
};

export const userService = {
    getAllUsers, updateUserRole, updateUserProfile
};