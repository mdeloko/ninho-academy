import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ninho-academy-super-secret-key-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const gerarToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verificarToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (erro) {
    return null;
  }
};
