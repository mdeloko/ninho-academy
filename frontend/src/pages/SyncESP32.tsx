import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Check, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mascot } from '@/components/Mascot';
import { useESP32 } from '@/hooks/useESP32';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SyncESP32 = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { status, error, sincronizarComBackend } = useESP32();
  const [step, setStep] = useState<'inicial' | 'conectando' | 'sucesso' | 'erro'>('inicial');

  const handleConnect = async () => {
    setStep('conectando');
    try {
      await sincronizarComBackend();

      // Atualiza dados do usuário após sincronização
      await refreshUser();

      setStep('sucesso');
      toast.success('ESP32 conectado e sincronizado com sucesso!');

      // Redireciona para trilha após 2 segundos
      setTimeout(() => {
        navigate('/trilha');
      }, 2000);
    } catch (err: any) {
      setStep('erro');
      toast.error(err.message || 'Erro ao conectar ESP32');
    }
  };

  const handleSkip = () => {
    navigate('/trilha');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'error':
        return 'Erro de conexão';
      default:
        return 'Desconectado';
    }
  };

  if (step === 'sucesso') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="p-12 max-w-md text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Check className="w-24 h-24 mx-auto mb-6 text-success" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">ESP32 Sincronizado!</h1>
            <p className="text-muted-foreground mb-4">
              Seu dispositivo está conectado e pronto para as missões práticas.
            </p>
            <div className="text-sm text-muted-foreground">
              Redirecionando para trilha...
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <Mascot size="md" />
          <h1 className="text-4xl font-bold mt-6 mb-2">
            Conectar ESP32
          </h1>
          <p className="text-lg opacity-90">
            Vamos sincronizar seu dispositivo para começar as missões práticas!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Cpu className={`w-8 h-8 ${getStatusColor()}`} />
                <div>
                  <h3 className="font-bold">Status do ESP32</h3>
                  <p className={`text-sm ${getStatusColor()}`}>
                    {getStatusText()}
                  </p>
                </div>
              </div>
              {step === 'conectando' && (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Como Conectar</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold">Conecte o ESP32 via USB</p>
                  <p className="text-sm text-muted-foreground">
                    Conecte seu ESP32 em uma porta USB do computador
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold">Clique em "Conectar ESP32"</p>
                  <p className="text-sm text-muted-foreground">
                    Uma janela vai abrir para você selecionar a porta serial
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold">Selecione o dispositivo correto</p>
                  <p className="text-sm text-muted-foreground">
                    Procure por "USB Serial", "CP210x", "CH340" ou similar
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Help Alert */}
          <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Não está conseguindo conectar?</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/ajuda-esp32')}
                className="h-auto p-0"
              >
                Ver guia completo
              </Button>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              className="flex-1"
              disabled={step === 'conectando'}
            >
              Pular por Agora
            </Button>
            <Button
              variant="gradient"
              size="lg"
              onClick={handleConnect}
              className="flex-1"
              disabled={step === 'conectando'}
            >
              {step === 'conectando' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 mr-2" />
                  Conectar ESP32
                </>
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="p-4 bg-muted">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Dica:</strong> Você pode pular esta etapa e conectar o ESP32 mais tarde
              quando for fazer uma missão prática.
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default SyncESP32;
