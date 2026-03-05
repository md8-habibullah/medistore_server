import { Router } from "express";
import { userController } from "./user.controller";
import { authVerify, Roles } from "../../middlewire/authVerify";

const router = Router();

// Only Admin can see users and change roles
router.get("/", authVerify(Roles.ADMIN), userController.getAllUsers);
router.patch("/roleChange", authVerify(Roles.ADMIN), userController.updateUserRole);
router.get("/profile", authVerify(Roles.ADMIN, Roles.CUSTOMER, Roles.SELLER), userController.getMyProfile);
router.patch("/updateProfile", authVerify(Roles.ADMIN, Roles.CUSTOMER, Roles.SELLER), userController.updateMyProfile);

export const userRouter: Router = router;