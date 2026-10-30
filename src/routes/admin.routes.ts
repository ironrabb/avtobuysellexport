import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAdmin } from '../libs/utils/auth';
import { requireAuth } from '../libs/utils/auth';
import { MemberController } from '../controllers/member.controller';

const router = Router();
router.get('/login', AdminController.loginForm);
router.post('/login', AdminController.login);
router.post('/logout', requireAuth, MemberController.logout);
router.get('/cars', requireAdmin, AdminController.dashboard);
router.post('/cars/:id/moderate', requireAdmin, AdminController.moderate);
export default router;
