import { Router } from 'express';
import {
  changePassword,
  getCurrentUser,
  login,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, getCurrentUser);
router.post('/change-password', requireAuth, changePassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
