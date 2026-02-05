import type { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                roles: string;
                emailVerified: boolean;
            }
        }
    }
}


enum Roles {
    CUSTOMER = "CUSTOMER",
    SELLER = "SELLER",
    MANAGER = "MANAGER",
    DEVELOPER = "DEVELOPER",
    ADMIN = "ADMIN"
}

const authVerify = (...roles: Roles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
                return res.status(401).json(
                    {
                        success: false,
                        message: "You are Not Authorized"
                    }
                )
            }

            if (session.user.emailVerified === false) {
                return res.status(403).json(
                    {
                        success: false,
                        message: "Please Verify Your Email"
                    }
                )
            }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                roles: session.user.role || "",
                emailVerified: session.user.emailVerified
            }

            next();
        } catch (error) {
            console.error("Authentication Error:", error);
            next(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };
}


export { authVerify, Roles };