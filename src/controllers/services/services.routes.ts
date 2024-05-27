import { Router } from 'express';
import * as sectioncontroller from './services.controller';
import * as authMiddleware from '../../middleware/auth'
import { upload } from '../../middleware/fileUpload';

// Set up multer middleware
const router = Router();

router.route('/').post(authMiddleware.isAuthorized, sectioncontroller.servicesList);
router.route('/add').post(upload.single('file'), sectioncontroller.addService);
router.route('/*').get(authMiddleware.isAuthorized, sectioncontroller.FindOneService);
router.route('/*').delete(authMiddleware.isAuthorized, sectioncontroller.DeleteService);

export default router