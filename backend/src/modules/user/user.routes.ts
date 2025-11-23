import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/:id', authMiddleware, (req, res) => userController.buscarUsuario(req, res));
router.post('/:id/esp32-status', authMiddleware, (req, res) => userController.atualizarPerfilESP32(req, res));
router.post('/:id/mark-synced', authMiddleware, (req, res) => userController.marcarComoSincronizado(req, res));

export default router;
