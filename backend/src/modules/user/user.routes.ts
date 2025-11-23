import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();

router.get('/:id', (req, res) => userController.buscarUsuario(req, res));
router.post('/:id/esp32-status', (req, res) => userController.atualizarPerfilESP32(req, res));
router.post('/:id/mark-synced', (req, res) => userController.marcarComoSincronizado(req, res));

export default router;
