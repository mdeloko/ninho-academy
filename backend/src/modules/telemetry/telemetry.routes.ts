import { Router } from 'express';
import { telemetryController } from './telemetry.controller';

const router = Router();

router.post('/verify-session', (req, res) => telemetryController.verificar(req, res));

export default router;
