import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.FRONTEND_APP_URL!, "http://localhost:3000"],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "CUSTOMER",
                input: false

            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 1,
        requireEmailVerification: true,
    },

});