-- SQLite
CREATE TABLE Usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    data_nascimento DATE
);

CREATE TABLE Progresso (
    id_progresso INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    xp_total INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario)
);

-- Adiciona o usuário
INSERT INTO Usuarios (nome, email, senha, data_nascimento)
VALUES ('jogador1', 'jogador@email.com', '!Senha123', '2000-01-30');

INSERT INTO Usuarios (nome, email, senha, data_nascimento)
VALUES ('Jogador 2', 'jogador2@email.com', '$2b$10$HfNfMzxi3DIYEWogI8bDn.2L4G4W8/3RGFl2SQOihuobrxCYyNLlO', '2000-08-20');

-- Adiciona o progresso inicial (XP 0) para esse usuário
-- (Aqui, 1 é o id do 'jogador1' que acabamos de inserir)
INSERT INTO Progresso (id_usuario, xp_total)
VALUES (1, 0);

-- Consulta para verificar os dados inseridos
SELECT u.nome, u.email, p.xp_total, p.nivel
FROM Usuarios u
JOIN Progresso p ON u.id_usuario = p.id_usuario
WHERE u.id_usuario = 1;

UPDATE Progresso
SET xp_total = xp_total + 50
WHERE id_usuario = 1;

SELECT u.nome, u.email, p.xp_total, p.nivel
FROM Usuarios u
JOIN Progresso p ON u.id_usuario = p.id_usuario 
WHERE u.id_usuario = 1; 