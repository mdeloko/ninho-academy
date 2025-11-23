import { Router } from 'express';
import { authController } from './auth.controller.ts';

const router = Router();

router.post('/login', (req, res) => authController.autenticar(req, res));
router.post('/register', (req, res) => authController.registrar(req, res));

export default router;
