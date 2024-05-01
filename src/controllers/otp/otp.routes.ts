import { Router } from 'express';
import * as OTP from './otp.controller';

const router = Router();

router.post('/sendOTP', OTP.sendOTP);
router.post('/verifyOTP', OTP.verifyOTP);

export default router;