import { Router } from 'express';
import {
  approveAccessRequest,
  getAccessRequests,
  rejectAccessRequest,
  resendCredentials,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/access-requests', getAccessRequests);
router.post('/access-requests/:requestId/approve', approveAccessRequest);
router.post('/access-requests/:requestId/reject', rejectAccessRequest);
router.post('/access-requests/:requestId/resend-credentials', resendCredentials);

export default router;
