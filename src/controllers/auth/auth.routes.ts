import { Router } from 'express';
import * as CredentialsController from './auth.controller';
import * as CredentialsValidator from '../../validators/credentials.validator';
const router = Router();

router.route('/login').post(CredentialsController.login);


export default router