import { Router } from 'express';
import authRouter from './controllers/auth/auth.routes';
import adminRoutes from './controllers/accounts/accounts.routes';
import ContactUs from './controllers/contactus/contactus.routes'
import ServiceRouter from './controllers/services/services.routes'
import otpRouter from './controllers/otp/otp.routes'
import dashboard from './controllers/dashboard/dashboard.routes'

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRoutes);
router.use('/contactus', ContactUs);
router.use('/service', ServiceRouter);
router.use('/otp', otpRouter);
router.use('/dashboard', dashboard);


export default router;                     