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

type Tela = "LANDING" | "AUTH_LOGIN" | "AUTH_REGISTER" | "AUTH_FORGOT" | "SETUP" | "SYNC" | "DASHBOARD" | "LESSON";

const App: React.FC = () => {
  const [tela, setTela] = useState<Tela>("LANDING");
  const [licaoAtiva, setLicaoAtiva] = useState<Lesson | null>(null);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [mostrarSubiuNivel, setMostrarSubiuNivel] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Restaurar sessão ao montar o componente
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("user");
    const tokenSalvo = localStorage.getItem("token");

    if (usuarioSalvo && tokenSalvo) {
      try {
        const usuarioRestaurado = JSON.parse(usuarioSalvo);
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
      }
    }
    setCarregando(false);
  }, []);

  const aoAutenticarComSucesso = (usuarioLogado: User) => {
    // Garantir que o usuário tem todos os campos necessários
    const usuarioCompleto: User = {
      ...usuarioLogado,
      licoesConcluidas: usuarioLogado.licoesConcluidas || [],
      temESP32: usuarioLogado.temESP32 || false,
      sincronizado: usuarioLogado.sincronizado || false,
      trilhaId: usuarioLogado.trilhaId || undefined,
      conquistas: usuarioLogado.conquistas || [],
    };

    setUsuario(usuarioCompleto);

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
    if (!usuario || !licaoAtiva) return;

    setUsuario((prev) =>
      prev
        ? {
            ...prev,
            xp: prev.xp + xpGanho,
            licoesConcluidas: [...prev.licoesConcluidas, licaoAtiva.id],
          }
        : null
    );

    // Removido: chamada API (mockar por enquanto)

    setMostrarSubiuNivel(true);
    setTimeout(() => setMostrarSubiuNivel(false), 3000);
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
          <Dashboard user={usuario} onLessonSelect={aoSelecionarLicao} />
        </>
      )}

      {tela === "LESSON" && licaoAtiva && usuario && <LessonRunner lesson={licaoAtiva} user={usuario} onComplete={aoCompletarLicao} onExit={() => setTela("DASHBOARD")} />}

      {mostrarSubiuNivel && (
        <div className="fixed bottom-8 right-8 bg-brand-yellow text-brand-brown p-4 rounded-2xl border-b-4 border-brand-darkYellow shadow-xl animate-bounce z-50 flex items-center gap-4">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="font-extrabold text-lg">Lição Concluída!</div>
            <div className="font-bold text-sm opacity-80">+50 XP Ganho</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
