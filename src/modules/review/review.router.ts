import { Router } from "express";
import { reviewController } from "./review.controller";
import { authVerify, Roles } from "../../middlewire/authVerify";

const router = Router();

router.post("/", authVerify(Roles.CUSTOMER), reviewController.addReview);
router.get("/:medicineId", reviewController.getMedicineReviews);

export const reviewRouter: Router = router;