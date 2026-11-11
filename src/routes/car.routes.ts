import { Router } from "express";
import { CarController } from "../controllers/car.controller";
import { uploadCarImages } from "../libs/utils/uploader";
import {
  requireAuth,
  requireSeller,
  requireSellerOrAdmin,
} from "../libs/utils/auth";

const router = Router();
router.get("/", CarController.list);
router.get("/mine", requireSeller, CarController.listMine);
router.get("/favorites/my", requireAuth, CarController.myFavorites);
router.get("/favorites/ids", requireAuth, CarController.myFavoriteIds);
router.post("/:id/favorite", requireAuth, CarController.toggleFavorite);
router.patch("/:id", requireSeller, uploadCarImages, CarController.updateMine);
router.delete("/:id", requireSeller, CarController.deleteMine);
router.get("/:id", CarController.getById);
router.post("/", requireSellerOrAdmin, uploadCarImages, CarController.create);
export default router;
