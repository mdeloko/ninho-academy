import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ erro: 'Token não fornecido' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verificarToken(token);

    if (!decoded) {
      res.status(401).json({ erro: 'Token inválido ou expirado' });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (erro) {
    res.status(401).json({ erro: 'Erro ao validar token' });
  }
};
