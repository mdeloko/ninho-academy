<div align="center">
  <img src="frontend/assets/logo.png" alt="Ninho Academy Logo" width="200"/>

# Ninho Academy

**Plataforma educacional para ensino de eletrônica e programação com ESP32**

[![Deploy](https://img.shields.io/badge/deploy-online-success)](http://ninho-academy.43464994.xyz/)

</div>

---

## Sobre o Projeto

O **Ninho Academy** é uma plataforma educacional interativa que combina teoria e prática para ensinar fundamentos de eletrônica e programação.

### Objetivos

- Ensinar conceitos básicos de eletrônica de forma prática e visual
- Integrar teoria com montagem de circuitos reais usando ESP32
- Implementar sistema de gamificação para motivar e engajar estudantes
- Fornecer acompanhamento detalhado de progresso do aluno
- Criar missões práticas para consolidação do conhecimento

### Funcionalidades

- Interface web moderna e responsiva
- Sistema de missões práticas com validação automática
- Comunicação em tempo real com dispositivos ESP32
- Controle de componentes eletrônicos (LED, Buzzer, Sensores)

## Estrutura do Projeto

```
ninho-academy/
├─ frontend/                 # Aplicação React
│  ├─ pages/                # Páginas da aplicação
│  │  ├─ LandingPage.tsx    # Página inicial
│  │  ├─ LoginPage.tsx      # Login
│  │  ├─ RegisterPage.tsx   # Cadastro
│  │  ├─ Dashboard.tsx      # Painel do aluno
│  │  ├─ TrackSelection.tsx # Seleção de trilha
│  │  ├─ LessonRunner.tsx   # Execução de missões
│  │  └─ ESP32ConnectionPage.tsx # Conexão com ESP32
│  ├─ components/           # Componentes reutilizáveis
│  │  ├─ esp/               # Componentes ESP32
│  │  ├─ game/              # Componentes de gamificação
│  │  ├─ layout/            # Componentes de layout
│  │  └─ ui/                # Componentes de interface
│  ├─ services/             # Serviços e APIs
│  │  ├─ espService.ts      # Comunicação com ESP32
│  │  └─ progressService.ts # Gerenciamento de progresso
│  ├─ assets/               # Imagens e ícones
│  ├─ lib/                  # Bibliotecas e utilitários
│  ├─ config/               # Configurações
│  └─ data/                 # Dados estáticos
│
├─ backend/                  # API REST Node.js
│  ├─ src/
│  │  ├─ routes/            # Rotas da API
│  │  │  ├─ userRoutes.ts   # Rotas de usuário
│  │  │  └─ progressRoutes.ts # Rotas de progresso
│  │  ├─ controllers/       # Controladores
│  │  │  ├─ userController.ts
│  │  │  └─ progressController.ts
│  │  ├─ models/            # Modelos de dados
│  │  │  ├─ entities/       # Entidades do banco
│  │  │  ├─ dtos/           # Dtos
│  │  │  └─ repositories/   # Repositórios
│  │  ├─ services/          # Lógica de negócio
│  │  │  ├─ userService.ts
│  │  │  └─ progressService.ts
│  │  ├─ middlewares/       # Middlewares
│  │  │  └─ auth.ts         # Autenticação JWT
│  │  ├─ config/            # Configurações
│  │  ├─ db/                # Banco de dados
│  │  │  └─ database.ts     # Conexão SQLite
│  │  └─ utils/             # Utilitários
│  └─ postman/              # Coleções Postman
│
└─ firmware/                 # Código para ESP32
   ├─ src/
   │  └─ ninho/             # Código fonte
   │     ├─ ninho.ino       # Código Arduino
   │     ├─ protocol.cpp/h  # Protocolo de comunicação
   │     ├─ hardware_map.h  # Mapeamento de pinos
   │     ├─ user_id_store.cpp/h # Armazenamento de ID
   │     └─ version.h       # Versão do firmware
   ├─ platformio.ini        # Configuração PlatformIO
   └─ README.md             # Documentação do firmware
```

## Tecnologias Utilizadas

### Frontend

- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP

### Backend

- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

### Firmware

- **PlatformIO** - Plataforma de desenvolvimento para IoT
- **Arduino Framework** - Framework para ESP32
- **ArduinoJson** - Manipulação de JSON

## Como Rodar

### Requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **PlatformIO** (para buildar o firmware, somente se quiser, também pode buildar pelo Arduino IDE ou similar)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 3. Firmware (ESP32)

```bash
cd firmware
pio run --target upload
pio device monitor
```

O firmware será compilado e enviado para o ESP32 conectado via USB.

## Deploy

A aplicação está disponível online em: **[http://ninho-academy.43464994.xyz/](http://ninho-academy.43464994.xyz/)**

---
