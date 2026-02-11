
import { Router, type NextFunction, type Request, type Response } from "express";
import { medicineController } from "./medicine.controller";
import { authVerify, Roles } from "../../middlewire/authVerify";

const router: Router = Router();

// Define medicine-related routes here
router.get("/", medicineController.getAllMedicine)
router.post("/", authVerify(Roles.CUSTOMER, Roles.SELLER), medicineController.createMedicine);
router.get("/:id", medicineController.getMedicineByID)

export const medicineRouter: Router = router;