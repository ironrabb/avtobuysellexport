import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { requireAuth } from "../libs/utils/auth";
import { uploadProfileImage } from "../libs/utils/uploader";

const router = Router();
router.post("/signup", MemberController.register);
router.post("/login", MemberController.login);
router.post("/logout", requireAuth, MemberController.logout);
router.get("/me", requireAuth, MemberController.profile);
router.post(
  "/me/avatar",
  requireAuth,
  uploadProfileImage,
  MemberController.updateAvatar,
);
export default router;
