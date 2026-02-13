import { Router } from "express";
import { userController } from "./user.controller";
import { authVerify, Roles } from "../../middlewire/authVerify";

const router = Router();

// Only Admin can see users and change roles
router.get("/", authVerify(Roles.ADMIN), userController.getAllUsers);
router.patch("/:id/role", authVerify(Roles.ADMIN), userController.updateUserRole);
router.patch("/:id/role", authVerify(Roles.ADMIN), userController.updateMyProfile);

export const userRouter: Router = router;