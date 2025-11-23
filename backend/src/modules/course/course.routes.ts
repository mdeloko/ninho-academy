import { Router } from 'express';
import { courseController } from './course.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/map', authMiddleware, (req, res) => courseController.buscarMapa(req, res));

export default router;
