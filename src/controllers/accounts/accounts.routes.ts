import { Router } from 'express';
import * as AccountController from './accounts.controller';
import * as authMiddleware from '../../middleware/auth'

const router = Router();

router.route('/all-accounts').get(authMiddleware.isAuthorized, authMiddleware.isAdmin, AccountController.getAllAccounts);
router.route('/delete-account').delete(authMiddleware.isAuthorized, authMiddleware.isAdmin, AccountController.DeleteAccount);


export default router