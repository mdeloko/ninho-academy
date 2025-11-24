import React from "react";
import { User } from "../../types";
import { espService } from "../../services/espService";
import { Button } from "../ui/Button";

interface PropriedadesNavbar {
  user: User;
  onLogout?: () => void;
}

export const Navbar: React.FC<PropriedadesNavbar> = ({ user, onLogout }) => {
  const [statusSincronizacao, setStatusSincronizacao] = React.useState<"ocioso" | "sincronizando" | "sucesso" | "erro">("ocioso");
  const [mostrarMenu, setMostrarMenu] = React.useState(false);

  const aoSincronizarESP = async () => {
    if (!confirm("Conecte o ESP32 via USB. Deseja gravar seu ID nele agora?")) {
      return;
    }

    try {
      setStatusSincronizacao("sincronizando");
      await espService.definirIdentidade(user.id);
      setStatusSincronizacao("sucesso");

      setTimeout(() => setStatusSincronizacao("ocioso"), 3000);
    } catch (erro: any) {
      setStatusSincronizacao("erro");
      alert("Erro ao sincronizar: " + (erro.message || "Erro desconhecido"));

      setTimeout(() => setStatusSincronizacao("ocioso"), 2000);
    }
  };

  const aoSair = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      setMostrarMenu(false);
      if (onLogout) onLogout();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-beige/95 backdrop-blur-sm border-b-2 border-brand-brown/10 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border-2 border-brand-brown object-cover" />
          <span className="font-extrabold text-brand-brown text-xl hidden sm:block">Ninho Academy</span>
        </div>

        <div className="flex items-center gap-4 relative">
          {user.temESP32 && (
            <Button
              onClick={aoSincronizarESP}
              disabled={statusSincronizacao === "sincronizando"}
              variant={statusSincronizacao === "sucesso" ? "success" : statusSincronizacao === "erro" ? "danger" : statusSincronizacao === "sincronizando" ? "secondary" : "outline"}
              size="sm"
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl text-xs"
              title="Gravar o ID no ESP32"
            >
              <span>{statusSincronizacao === "sincronizando" ? "⏳" : statusSincronizacao === "sucesso" ? "✅" : statusSincronizacao === "erro" ? "❌" : "🔄"}</span>
              <span className="ml-1">
                {statusSincronizacao === "sincronizando" ? "Sincronizando..." : statusSincronizacao === "sucesso" ? "Sucesso!" : statusSincronizacao === "erro" ? "Erro" : "Sincronizar ESP32"}
              </span>
            </Button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white border-2 border-gray-100">
            <span className="text-xl">🔌</span>
            <span className="text-brand-brown font-bold text-sm">{user.temESP32 ? "Com ESP32" : "Sem ESP32"}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border-2 border-gray-100">
            <span className="text-xl">⭐</span>
            <span className="text-brand-yellow font-black">{user.xp} XP</span>
          </div>

          <button onClick={() => setMostrarMenu(!mostrarMenu)} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden hover:border-blue-400 transition-colors">
            <img src="/assets/avatar.png" alt="Avatar" />
          </button>

          {mostrarMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border-2 border-gray-100 shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="font-bold text-brand-brown">{user.nome}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button onClick={aoSair} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold transition-colors">
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
