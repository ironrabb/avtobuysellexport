import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { requireAuth } from '../libs/utils/auth';

const router = Router();
router.post('/register', MemberController.register);
router.post('/login', MemberController.login);
router.post('/logout', requireAuth, MemberController.logout);
router.get('/me', requireAuth, MemberController.profile);
export default router;
