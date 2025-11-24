import React, { useState } from "react";
import { Button } from "../components/ui/Button";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateRegister, onNavigateForgot, onBack }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // MOCK: Simular login sem fazer chamada real
      await new Promise((r) => setTimeout(r, 800)); // Simular delay

      if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
      }

      // Mock de usuário
      const mockToken = btoa(
        JSON.stringify({
          id: "mock-user-" + Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split("@")[0],
          iat: Math.floor(Date.now() / 1000),
        })
      );

      // Separar token em 3 partes (simulando JWT)
      const tokenFake = `header.${mockToken}.signature`;

      console.log("[MOCK] Login bem-sucedido para:", email);

      // Salvar token
      localStorage.setItem("token", tokenFake);

      // Decodificar token para pegar user info
      const tokenPayload = JSON.parse(atob(tokenFake.split(".")[1]));
      onLoginSuccess({
        id: tokenPayload.id,
        email: tokenPayload.email,
        nome: tokenPayload.name || "Usuário",
        xp: 0,
        sequenciaDias: 1,
        temESP32: false,
        sincronizado: false,
        trilhaId: "TRACK_IOT",
        licoesConcluidas: [],
        conquistas: [],
      });
    } catch (erro: any) {
      console.error("[MOCK] Erro no login:", erro);
      setErro(erro.message || "Erro ao entrar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-b-4 border-brand-brown/10 shadow-lg relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-brand-brown font-bold">
          ← Voltar
        </button>

        <div className="text-center mb-8 pt-6">
          <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center border-2 border-brand-brown mx-auto mb-4 p-2">
            <img src="/assets/logo.png" alt="Ninho Academy" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-brown">Bem-vindo de volta!</h1>
        </div>

        <form onSubmit={aoEnviar} className="space-y-4">
          <div>
            <label className="block text-brand-brown font-bold text-sm mb-2 uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-brown focus:outline-none focus:border-brand-yellow focus:bg-white transition-colors"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-brand-brown font-bold text-sm mb-2 uppercase tracking-wide">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-brown focus:outline-none focus:border-brand-yellow focus:bg-white transition-colors"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm font-bold">{erro}</div>}

          <div className="pt-4">
            <Button fullWidth size="lg" disabled={carregando}>
              {carregando ? "Entrando..." : "ENTRAR"}
            </Button>
          </div>

          <div className="text-center">
            <button type="button" onClick={onNavigateForgot} className="text-xs font-bold text-gray-400 hover:text-brand-brown uppercase" tabIndex={-1}>
              Esqueci a senha
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t-2 border-gray-100 pt-6">
          <p className="text-gray-500 font-bold mb-4">Ainda não tem uma conta?</p>
          <Button variant="outline" fullWidth onClick={onNavigateRegister}>
            CRIAR CONTA
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
