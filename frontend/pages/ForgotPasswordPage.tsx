import React from 'react';
import { Button } from '../components/ui/Button';

interface PropriedadesEsqueciSenha {
  onBack: () => void;
}

export const ForgotPasswordPage: React.FC<PropriedadesEsqueciSenha> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-b-4 border-brand-brown/10 shadow-lg text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          🔧
        </div>

        <h1 className="text-2xl font-extrabold text-brand-brown mb-4">Recuperação de Senha</h1>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2">Função Desativada</h3>
          <p className="text-yellow-700 text-sm">
            No momento, nosso sistema de email automatizado está em manutenção. Por favor, entre
            em contato com o administrador do sistema se você perdeu o acesso.
          </p>
        </div>

        <Button fullWidth onClick={onBack}>
          Voltar para Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
