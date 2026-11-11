import { Router } from "express";
import { CarController } from "../controllers/car.controller";
import { uploadCarImages } from "../libs/utils/uploader";
import { requireSeller, requireSellerOrAdmin } from "../libs/utils/auth";

const router = Router();
router.get("/", CarController.list);
router.get("/mine", requireSeller, CarController.listMine);
router.patch("/:id", requireSeller, uploadCarImages, CarController.updateMine);
router.delete("/:id", requireSeller, CarController.deleteMine);
router.get("/:id", CarController.getById);
router.post("/", requireSellerOrAdmin, uploadCarImages, CarController.create);
export default router;
