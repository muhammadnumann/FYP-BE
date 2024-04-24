import { Router } from 'express';
import * as CredentialsController from './auth.controller';
import * as CredentialsValidator from '../../validators/credentials.validator';
import * as AccountController from '../accounts/accounts.controller'

const router = Router();

router.route('/sign-in').post(CredentialsController.login);
router.route('/sign-up').post(AccountController.AddAccount);

export default router