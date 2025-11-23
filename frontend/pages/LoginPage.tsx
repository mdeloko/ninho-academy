import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { ENDPOINTS } from "../config/api";

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
      const resposta = await fetch(ENDPOINTS.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao entrar.");
      }

      onLoginSuccess(dados.usuario);
    } catch (erro: any) {
      setErro(erro.message);
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
