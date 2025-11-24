import React, { useState } from "react";
import { Button } from "../components/ui/Button";

interface RegisterPageProps {
  onRegisterSuccess: (user: any) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      // MOCK: Simular registro sem fazer chamada real
      await new Promise((r) => setTimeout(r, 800)); // Simular delay

      // Mock de token
      const mockToken = btoa(
        JSON.stringify({
          id: "mock-user-" + Math.random().toString(36).substr(2, 9),
          email: email,
          name: nome,
          iat: Math.floor(Date.now() / 1000),
        })
      );

      // Separar token em 3 partes (simulando JWT)
      const tokenFake = `header.${mockToken}.signature`;

      console.log("[MOCK] Cadastro bem-sucedido para:", email);

      // Salvar token
      localStorage.setItem("token", tokenFake);

      // Decodificar token para pegar user info
      const tokenPayload = JSON.parse(atob(tokenFake.split(".")[1]));
      onRegisterSuccess({
        id: tokenPayload.id,
        email: tokenPayload.email,
        nome: tokenPayload.name || nome,
        xp: 0,
        sequenciaDias: 1,
        temESP32: false,
        sincronizado: false,
        trilhaId: undefined,
        licoesConcluidas: [],
        conquistas: [],
      });
    } catch (erro: any) {
      console.error("[MOCK] Erro no cadastro:", erro);
      setErro(erro.message || "Erro ao criar conta.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-b-4 border-brand-brown/10 shadow-lg relative">
        <button onClick={onNavigateLogin} className="absolute top-6 left-6 text-gray-400 hover:text-brand-brown font-bold">
          ← Voltar
        </button>

        <div className="text-center mb-8 pt-6">
          <h1 className="text-3xl font-extrabold text-brand-brown">Crie seu perfil</h1>
          <p className="text-gray-500 font-bold mt-2">Comece sua jornada eletrônica!</p>
        </div>

        <form onSubmit={aoEnviar} className="space-y-4">
          <div>
            <label className="block text-brand-brown font-bold text-sm mb-2 uppercase tracking-wide">Nome</label>
            <input
              type="text"
              required
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-brown focus:outline-none focus:border-brand-yellow focus:bg-white transition-colors"
              placeholder="Seu Nome ou Apelido"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-brand-brown font-bold text-sm mb-2 uppercase tracking-wide">Repetir Senha</label>
            <input
              type="password"
              required
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-brown focus:outline-none focus:border-brand-yellow focus:bg-white transition-colors"
              placeholder="Confirme a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm font-bold">{erro}</div>}

          <div className="pt-4">
            <Button fullWidth size="lg" disabled={carregando} variant="success">
              {carregando ? "Criando..." : "CADASTRAR"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
