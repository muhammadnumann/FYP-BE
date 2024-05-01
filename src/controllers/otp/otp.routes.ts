import { Router } from 'express';
import * as OTP from './otp.controller';

const router = Router();

router.get('/sendOTP', OTP.sendOTP);
router.get('/verifyOTP', OTP.verifyOTP);

export default router;