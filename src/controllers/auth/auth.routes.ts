import { Router } from 'express';
import * as CredentialsController from './auth.controller';
import * as CredentialsValidator from '../../validators/credentials.validator';
import * as AccountController from '../accounts/accounts.controller'
import * as authMiddleware from '../../middleware/auth'

const router = Router();

router.route('/sign-in').post(CredentialsValidator.login, CredentialsController.login);
router.route('/sign-up').post(CredentialsValidator.signup, AccountController.AddAccount);
router.route('/update-password').post(authMiddleware.isAuthorized, CredentialsController.updatePassword);
router.route('/forget-password').post(CredentialsController.forgetPassword);

export default router