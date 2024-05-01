import { Router } from 'express';
import * as sectioncontroller from './services.controller';
import * as authMiddleware from '../../middleware/auth'
import { upload } from '../../middleware/fileUpload';

// Set up multer middleware
const router = Router();

router.route('').get(authMiddleware.isAdmin, sectioncontroller.servicesList);
router.route('/list').get(authMiddleware.isAuthorized, sectioncontroller.servicesList);
router.route('/add').post(authMiddleware.isAuthorized, upload.single('file'), sectioncontroller.addService);
router.route('/*').get(authMiddleware.isAuthorized, sectioncontroller.FindOneService);
router.route('/*').delete(authMiddleware.isAuthorized, sectioncontroller.DeleteService);

export default router