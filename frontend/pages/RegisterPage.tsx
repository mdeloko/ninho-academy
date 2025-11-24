import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { ENDPOINTS } from "../config/api";
import { progressService } from "../services/progressService";

interface RegisterPageProps {
  onRegisterSuccess: (user: any, initialProgress?: any) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
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

    if (!dataNascimento) {
      setErro("Data de nascimento é obrigatória.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(ENDPOINTS.auth.registrar, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
          email,
          password: senha,
          birth_date: dataNascimento,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || "Erro ao criar conta.");
      }

      // Salvar token e usuário no localStorage para persistência
      localStorage.setItem("token", dados.token);

      // Decodificar token JWT para pegar user info
      const tokenPayload = JSON.parse(atob(dados.token.split(".")[1]));
      const usuario = {
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
      };

      // Salvar dados do usuário também
      localStorage.setItem("user", JSON.stringify(usuario));

      // Criar progresso inicial para o novo usuário
      let initialProgress = null;
      try {
        console.log("[REGISTER] Criando progresso inicial...");
        initialProgress = await progressService.createProgress(usuario.id);
      } catch (progErro) {
        console.error("[REGISTER] Erro ao criar progresso inicial:", progErro);
        // Não falhar o registro se o progresso falhar, o App tentará buscar/criar depois
      }

      console.log("[REGISTER] Cadastro bem-sucedido:", email);
      onRegisterSuccess(usuario, initialProgress);
    } catch (erro: any) {
      console.error("[REGISTER] Erro:", erro);
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
            <label className="block text-brand-brown font-bold text-sm mb-2 uppercase tracking-wide">Data de Nascimento</label>
            <input
              type="date"
              required
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-brown focus:outline-none focus:border-brand-yellow focus:bg-white transition-colors"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
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
