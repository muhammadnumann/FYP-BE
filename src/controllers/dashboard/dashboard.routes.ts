import { Router } from 'express';
import * as Daashboard from './dashboard.controller';
import * as authMiddleware from '../../middleware/auth'

const router = Router();

router.post('/get-detail', authMiddleware.isAuthorized, Daashboard.GetDetail);

export default router;