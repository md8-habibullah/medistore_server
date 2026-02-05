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
    baseURL: process.env.BETTER_AUTH_URL,
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
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            // Callback URL override
            url = `${process.env.FRONTEND_APP_URL}/verify-email?token=${token}`;
            sendVerificationEmail(user.email, url, token);
            // console.log(`Send verification email to ${user.email} with url: ${url} and token: ${token}`);
            // to: user.email,
            // subject: "Verify your email address",
            // text: `Click the link to verify your email: ${url}`,
        },
    },
    socialProviders: {

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",

        },
    },

});