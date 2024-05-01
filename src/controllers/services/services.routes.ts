import { Router } from 'express';
import * as sectioncontroller from './services.controller';
import * as authMiddleware from '../../middleware/auth'
import upload from '../../middleware/fileUpload';

// Set up multer middleware
const router = Router();

router.route('').get(sectioncontroller.servicesList);
router.route('/add').post(upload.single('image'), sectioncontroller.AddSections);
router.route('/edit').post(authMiddleware.isAuthorized, upload.single('sectionImage'), sectioncontroller.EditSection);
router.route('/*').get(sectioncontroller.FindOneSection);
router.route('/*').delete(authMiddleware.isAuthorized, sectioncontroller.DeleteSection);

export default router