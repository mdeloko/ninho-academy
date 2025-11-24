import React, { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { LessonRunner } from "./pages/LessonRunner";
import { TrackSelection } from "./pages/TrackSelection";
import { SyncESP32Page } from "./pages/SyncESP32Page";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { Lesson, User } from "./types";
import { ENDPOINTS } from "./config/api";
import { progressService, type Progress } from "./services/progressService";

import { missions } from "./data/missions";

type Tela = "LANDING" | "AUTH_LOGIN" | "AUTH_REGISTER" | "AUTH_FORGOT" | "SETUP" | "SYNC" | "DASHBOARD" | "LESSON";

const App: React.FC = () => {
  const [tela, setTela] = useState<Tela>("LANDING");
  const [licaoAtiva, setLicaoAtiva] = useState<Lesson | null>(null);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [progresso, setProgresso] = useState<Progress | null>(null);
  const [mostrarSubiuNivel, setMostrarSubiuNivel] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Restaurar sessão ao montar o componente
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("user");
    const tokenSalvo = localStorage.getItem("token");
    const progressoSalvo = localStorage.getItem("userProgress");

    if (usuarioSalvo && tokenSalvo) {
      try {
        const usuarioRestaurado = JSON.parse(usuarioSalvo);

        // Restaurar progresso também
        if (progressoSalvo) {
          const prog = JSON.parse(progressoSalvo);
          setProgresso(prog);

          // Atualizar XP e Level do usuário com base no progresso persistido
          usuarioRestaurado.xp = prog.totalXp;
          // Opcional: se quiser guardar o level no objeto user também
          // usuarioRestaurado.level = prog.level;
        }

        setUsuario(usuarioRestaurado);

        // Ir direto para dashboard se ele já tinha trilha selecionada
        if (usuarioRestaurado.trilhaId) {
          setTela("DASHBOARD");
        } else {
          setTela("SETUP");
        }
      } catch (erro) {
        console.error("[APP] Erro ao restaurar sessão:", erro);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userProgress");
      }
    }
    setCarregando(false);
  }, []);

  const aoAutenticarComSucesso = async (usuarioLogado: User, initialProgress?: Progress) => {
    // Garantir que o usuário tem todos os campos necessários
    const usuarioCompleto: User = {
      ...usuarioLogado,
      licoesConcluidas: usuarioLogado.licoesConcluidas || [],
      temESP32: usuarioLogado.temESP32 || false,
      sincronizado: usuarioLogado.sincronizado || false,
      trilhaId: usuarioLogado.trilhaId || undefined,
      conquistas: usuarioLogado.conquistas || [],
    };

    // Se já temos o progresso inicial (ex: registro), usar ele
    if (initialProgress) {
      setProgresso(initialProgress);
      localStorage.setItem("userProgress", JSON.stringify(initialProgress));

      // Sincronizar XP do usuário com o progresso
      usuarioCompleto.xp = initialProgress.totalXp;
    } else {
      // Carregar progresso do usuário (ex: login)
      try {
        const prog = await progressService.getProgressByUserId(usuarioCompleto.id);
        if (prog) {
          setProgresso(prog);
          localStorage.setItem("userProgress", JSON.stringify(prog));

          // Sincronizar XP do usuário com o progresso carregado
          usuarioCompleto.xp = prog.totalXp;
        }
      } catch (erro) {
        console.error("[APP] Erro ao carregar progresso:", erro);
      }
    }

    setUsuario(usuarioCompleto);
    localStorage.setItem("user", JSON.stringify(usuarioCompleto));

    if (usuarioCompleto.trilhaId) {
      setTela("DASHBOARD");
    } else {
      setTela("SETUP");
    }
  };

  const aoCompletarConfiguracao = async (trilhaId: string, temESP32: boolean) => {
    if (!usuario) return;

    const usuarioAtualizado = { ...usuario, trilhaId, temESP32 };
    setUsuario(usuarioAtualizado);

    // Removido: chamada API para ESP32 status

    // Pular sincronização ESP32 por enquanto
    setTela("DASHBOARD");
  };

  const aoCompletarSincronizacao = async () => {
    if (!usuario) return;

    setUsuario((prev) => (prev ? { ...prev, sincronizado: true } : null));

    // Removido: chamada API para marcar sincronizado

    setTela("DASHBOARD");
  };

  const aoPularSincronizacao = () => {
    setTela("DASHBOARD");
  };

  const aoSelecionarLicao = (licao: Lesson) => {
    setLicaoAtiva(licao);
    setTela("LESSON");
  };

  const aoCompletarLicao = async (xpGanho: number) => {
    console.log("[APP] aoCompletarLicao chamado:", { usuario: usuario?.id, licaoAtiva: licaoAtiva?.id, progresso: progresso?.id, xpGanho });

    if (!usuario) {
      console.error("[APP] Usuário não encontrado");
      return;
    }

    if (!licaoAtiva) {
      console.error("[APP] Lição ativa não encontrada");
      return;
    }

    // --- LÓGICA DE PROTEÇÃO CONTRA REPETIÇÃO ---
    // Encontrar o índice da missão atual na lista global
    const missionIndex = missions.findIndex((m) => m.id === licaoAtiva.id);

    // Obter o nível atual (que representa quantas missões já foram completadas)
    // Se progresso for null, assume 0
    const currentLevel = progresso?.level || 0;

    // Se o índice da missão for menor que o nível atual, significa que o usuário
    // já passou dessa fase (ex: Nível 2 tentando fazer Missão 0 ou 1).
    // Nesse caso, não damos XP nem subimos de nível.
    if (missionIndex < currentLevel) {
      console.log(`[APP] Missão ${licaoAtiva.id} (Index ${missionIndex}) já completada anteriormente (Nível ${currentLevel}). XP não será atribuído.`);
      setTela("DASHBOARD");
      setLicaoAtiva(null);
      return; // SAIR DA FUNÇÃO AQUI
    }
    // -------------------------------------------

    try {
      // Se não houver progresso em estado, buscar do servidor
      let prog = progresso;
      if (!prog || prog.id === 0) {
        console.log("[APP] Progresso não encontrado em estado, buscando do servidor...");
        prog = await progressService.getProgressByUserId(usuario.id);
        if (prog) {
          setProgresso(prog);
        } else {
          console.error("[APP] Falha ao buscar progresso do servidor");
          alert("Erro ao carregar progresso. Recarregue a página.");
          return;
        }
      }

      // Enviar para backend
      console.log("[APP] Enviando para completeMission:", { userId: usuario.id, progressId: prog.id, missionId: licaoAtiva.id, xpGanho });
      const novoProgresso = await progressService.completeMission(usuario.id, prog.id, licaoAtiva.id, xpGanho);

      console.log("[APP] Progresso atualizado:", novoProgresso);
      setProgresso(novoProgresso);

      // Atualizar usuário com novo XP e level
      const novoUsuario = {
        ...usuario,
        xp: novoProgresso.totalXp,
        licoesConcluidas: [...usuario.licoesConcluidas, licaoAtiva.id],
      };

      setUsuario(novoUsuario);
      localStorage.setItem("user", JSON.stringify(novoUsuario)); // Persistir atualização do usuário

      setMostrarSubiuNivel(true);
      setTimeout(() => setMostrarSubiuNivel(false), 3000);
    } catch (erro) {
      console.error("[APP] Erro ao completar lição:", erro);
      alert("Erro ao salvar progresso. Tente novamente.");
      return;
    }

    setTela("DASHBOARD");
    setLicaoAtiva(null);
  };

  const aoSair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsuario(null);
    setTela("LANDING");
  };

  return (
    <div className="min-h-screen font-sans bg-brand-light">
      {tela === "LANDING" && <LandingPage onStart={() => setTela("AUTH_LOGIN")} />}

      {tela === "AUTH_LOGIN" && (
        <LoginPage onLoginSuccess={aoAutenticarComSucesso} onNavigateRegister={() => setTela("AUTH_REGISTER")} onNavigateForgot={() => setTela("AUTH_FORGOT")} onBack={() => setTela("LANDING")} />
      )}

      {tela === "AUTH_REGISTER" && <RegisterPage onRegisterSuccess={aoAutenticarComSucesso} onNavigateLogin={() => setTela("AUTH_LOGIN")} />}

      {tela === "AUTH_FORGOT" && <ForgotPasswordPage onBack={() => setTela("AUTH_LOGIN")} />}

      {tela === "SETUP" && <TrackSelection onConfirm={aoCompletarConfiguracao} />}

      {tela === "SYNC" && usuario && <SyncESP32Page userId={usuario.id} onSyncComplete={aoCompletarSincronizacao} onSkip={aoPularSincronizacao} />}

      {tela === "DASHBOARD" && usuario && (
        <>
          <Navbar user={usuario} onLogout={aoSair} />
          <Dashboard user={usuario} currentLevel={progresso?.level || 0} onLessonSelect={aoSelecionarLicao} />
        </>
      )}

      {tela === "LESSON" && licaoAtiva && usuario && <LessonRunner lesson={licaoAtiva} user={usuario} onComplete={aoCompletarLicao} onExit={() => setTela("DASHBOARD")} />}

      {mostrarSubiuNivel && progresso && (
        <div className="fixed bottom-8 right-8 bg-brand-yellow text-brand-brown p-4 rounded-2xl border-b-4 border-brand-darkYellow shadow-xl animate-bounce z-50 flex items-center gap-4">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="font-extrabold text-lg">Lição Concluída!</div>
            <div className="font-bold text-sm opacity-80">+50 XP • Nível {progresso.level}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
