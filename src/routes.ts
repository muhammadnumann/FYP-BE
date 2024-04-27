import { Router } from 'express';
import authRouter from './controllers/auth/auth.routes';
import adminRoutes from './controllers/accounts/accounts.routes';
import ContactUs from './controllers/contactus/contactus.routes'
import sectionRouter from './controllers/sections/section.routes'
import otpRouter from './controllers/otp/otp.routes'

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRoutes);
router.use('/contactus', ContactUs);
router.use('/section', sectionRouter);
router.use('/otp', otpRouter);


export default router;                     