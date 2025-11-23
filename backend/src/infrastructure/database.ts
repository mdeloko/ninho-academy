import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
}

export async function inicializarBancoDeDados() {
  try {
    await db.$connect();
    console.log('🚀 Banco de dados conectado via Prisma');

    // Cria usuário de desenvolvimento se não existir
    const usuario = await db.usuario.findUnique({ where: { id: 'user_123' } });

    if (!usuario) {
      await db.usuario.create({
        data: {
          id: 'user_123',
          nome: 'Aluno Pardal',
          email: 'aluno.pardal@ninho.academy',
          senha: 'password123',
          xp: 0,
          temEsp32: true,
          sincronizado: true,
        },
      });
      console.log('🧰 Seed: Usuário user_123 criado');
    }
  } catch (erro) {
    console.error('💥 Falha ao conectar ao banco de dados:', erro);
    process.exit(1);
  }
}
