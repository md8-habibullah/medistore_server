import { Router } from "express";
import { medicineController } from "./medicine.controller";

const router: Router = Router();

// Define medicine-related routes here
router.post("/", medicineController.createMedicine);

export const medicineRouter: Router = router;