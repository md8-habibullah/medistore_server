import type { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";


const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        // select: {
        //     id: true, name: true, email: true, role: true, createdAt: true, emailVerified: true
        // }
    });
    return result;
};

const updateUserRole = async (userId: string, role: Role) => {
    await prisma.session.deleteMany({
        where: {
            userId
        }
    });

    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            role
        }
    });
};

const getMyProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
}

const updateUserProfile = async (userId: string, data: { name?: string, image?: string }) => {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data
    });
};


export const userService = {
    getAllUsers, updateUserRole, getMyProfile, updateUserProfile
};