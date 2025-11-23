import { Router } from 'express';
import { progressController } from './progress.controller';

const router = Router();

router.post('/complete-lesson', (req, res) => progressController.completarLicao(req, res));

export default router;
