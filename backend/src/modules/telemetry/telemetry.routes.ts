import { Router } from 'express';
import { telemetryController } from './telemetry.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/verify-session', authMiddleware, (req, res) => telemetryController.verificar(req, res));

export default router;
