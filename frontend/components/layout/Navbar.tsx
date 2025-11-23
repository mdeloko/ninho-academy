import React from "react";
import { User } from "../../types";
import { espService } from "../../services/espService";
import { Button } from "../ui/Button";

interface PropriedadesNavbar {
  user: User;
}

export const Navbar: React.FC<PropriedadesNavbar> = ({ user }) => {
  const [statusSincronizacao, setStatusSincronizacao] = React.useState<"ocioso" | "sincronizando" | "sucesso" | "erro">("ocioso");

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

  return (
    <nav className="sticky top-0 z-50 bg-brand-beige/95 backdrop-blur-sm border-b-2 border-brand-brown/10 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border-2 border-brand-brown object-cover" />
          <span className="font-extrabold text-brand-brown text-xl hidden sm:block">{import.meta.env.VITE_APP_NAME || "Ninho Academy"}</span>
        </div>

        <div className="flex items-center gap-4">
          {user.temESP32 && (
            <button
              onClick={aoSincronizarESP}
              disabled={statusSincronizacao === "sincronizando"}
              className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-wider ${
                statusSincronizacao === "sucesso"
                  ? "bg-green-600 text-white border-green-700"
                  : statusSincronizacao === "erro"
                  ? "bg-red-600 text-white border-red-700"
                  : statusSincronizacao === "sincronizando"
                  ? "bg-gray-600 text-gray-300 border-gray-700 cursor-wait"
                  : "bg-brand-brown text-brand-yellow border-transparent hover:bg-gray-800"
              }`}
              title="Gravar meu ID no ESP32"
            >
              <span>{statusSincronizacao === "sincronizando" ? "⏳" : statusSincronizacao === "sucesso" ? "✅" : statusSincronizacao === "erro" ? "❌" : "🔄"}</span>
              {statusSincronizacao === "sincronizando" ? "Sincronizando..." : statusSincronizacao === "sucesso" ? "Sucesso!" : statusSincronizacao === "erro" ? "Erro" : "Sync ESP"}
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white border-2 border-gray-100">
            <span className="text-xl">🔌</span>
            <span className="text-brand-brown font-bold text-sm">{user.temESP32 ? "Com ESP32" : "Sem ESP32"}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border-2 border-gray-100">
            <span className="text-xl">⭐</span>
            <span className="text-brand-yellow font-black">{user.xp} XP</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden">
            <img src="/assets/avatar.png" alt="Avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};
