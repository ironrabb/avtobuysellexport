import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { requireAdmin } from "../libs/utils/auth";
import { MemberController } from "../controllers/member.controller";

const router = Router();
router.get("/", AdminController.loginForm);
router.get("/login", AdminController.loginForm);
router.post("/login", AdminController.login);
router.post("/logout", requireAdmin, MemberController.logout);
router.get("/cars", requireAdmin, AdminController.dashboard);
router.post("/cars/:id/moderate", requireAdmin, AdminController.moderate);
router.post("/cars/:id/delete", requireAdmin, AdminController.deleteCar);
router.get("/users", requireAdmin, AdminController.users);
router.post("/users/:id/status", requireAdmin, AdminController.setUserStatus);
router.post("/users/:id/delete", requireAdmin, AdminController.deleteUser);
export default router;
