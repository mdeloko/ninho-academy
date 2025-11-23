import { Router } from 'express';
import { courseController } from './course.controller';

const router = Router();

router.get('/map', (req, res) => courseController.buscarMapa(req, res));

export default router;
