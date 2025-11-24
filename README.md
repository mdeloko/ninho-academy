# Ninho Academy

Plataforma web para ensino de eletrônica e programação com ESP32.

**Deploy:** [http://ninho-academy.43464994.xyz/](http://ninho-academy.43464994.xyz/)

## Sobre o Projeto

Plataforma educacional que combina teoria e prática para ensinar fundamentos de eletrônica e programação embarcada usando ESP32. O projeto está em desenvolvimento ativo.

### Objetivos

- Ensinar conceitos básicos de eletrônica de forma prática
- Integrar teoria com montagem de circuitos reais
- Sistema de gamificação para motivar estudantes
- Acompanhamento de progresso

## Estrutura

```
ninho-academy/
├─ frontend/   # React + Vite + Tailwind
├─ backend/    # Node.js + Express + Prisma
└─ firmware/   # C++ para ESP32 (em desenvolvimento)
```

## Como Rodar

### Requisitos

- Node.js 18+
- npm ou yarn

### Backend

```bash
cd backend
npm install
npx prisma db push
npm run dev
```

Backend rodando em <http://localhost:3001>

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend rodando em <http://localhost:5173>
