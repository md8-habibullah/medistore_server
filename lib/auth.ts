import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { send } from "node:process";
import { sendVerificationEmail } from "./email";

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

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            sendVerificationEmail(user.email, url, token);
            // console.log(`Send verification email to ${user.email} with url: ${url} and token: ${token}`);
            // to: user.email,
            // subject: "Verify your email address",
            // text: `Click the link to verify your email: ${url}`,
        },
    },

});