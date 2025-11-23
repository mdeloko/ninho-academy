import express from 'express';
import cors from 'cors';
import { inicializarBancoDeDados } from './src/infrastructure/database';

import userRoutes from './src/modules/user/user.routes';
import courseRoutes from './src/modules/course/course.routes';
import progressRoutes from './src/modules/progress/progress.routes';
import telemetryRoutes from './src/modules/telemetry/telemetry.routes';
import authRoutes from './src/modules/auth/auth.routes';

const app = express();
const PORTA = 3001;

app.use(cors() as any);
app.use(express.json() as any);

app.use('/api/users', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    modulos: ['user', 'course', 'progress', 'telemetry', 'auth']
  });
});

inicializarBancoDeDados()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`🚀 Backend rodando em http://localhost:${PORTA}`);
      console.log(`📦 Módulos carregados com sucesso`);
    });
  })
  .catch((erro) => {
    console.error('Falha ao inicializar o banco de dados:', erro);
  });
