import { Router } from 'express';
import { progressController } from './progress.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/complete-lesson', authMiddleware, (req, res) => progressController.completarLicao(req, res));

export default router;
