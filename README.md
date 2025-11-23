# Ninho Academy

Projeto da disciplina Certificadora da Competência 2 - Engenharia de Computação UTFPR Cornélio Procópio.

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

Servidor rodando em http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Interface rodando em http://localhost:5173

## Limitações Conhecidas

- Integração com ESP32 ainda em desenvolvimento
- Sistema de validação de circuitos não implementado
- Alguns módulos teóricos incompletos
- Gamificação usa dados mockados
- Falta implementar sistema de recuperação de senha

## TODO

- [ ] Implementar comunicação real com ESP32
- [ ] Adicionar mais módulos de conteúdo
- [ ] Sistema de validação automática de circuitos
- [ ] Melhorar responsividade mobile
- [ ] Adicionar testes automatizados
- [x] Estrutura básica frontend e backend
- [x] Sistema de autenticação
- [x] Dashboard com progresso do usuário
