import { Cpu, Check, AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useESP32 } from '@/hooks/useESP32';

interface ESP32StatusProps {
  showConnectButton?: boolean;
  compact?: boolean;
}

export const ESP32Status = ({ showConnectButton = true, compact = false }: ESP32StatusProps) => {
  const navigate = useNavigate();
  const { status, estaConectado } = useESP32();

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Check,
          text: 'ESP32 Conectado',
          variant: 'default' as const,
          className: 'bg-success text-success-foreground',
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Conectando...',
          variant: 'secondary' as const,
          className: 'bg-warning text-warning-foreground',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Erro de Conexão',
          variant: 'destructive' as const,
          className: '',
        };
      default:
        return {
          icon: WifiOff,
          text: 'ESP32 Desconectado',
          variant: 'outline' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Icon
          className={`w-4 h-4 ${
            status === 'connecting' ? 'animate-spin' : ''
          } ${
            status === 'connected' ? 'text-success' :
            status === 'error' ? 'text-destructive' :
            'text-muted-foreground'
          }`}
        />
        {showConnectButton && !estaConectado && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/sync-esp32')}
            className="h-auto p-0 text-xs"
          >
            Conectar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className={config.className}>
        <Icon className={`w-3 h-3 mr-1 ${status === 'connecting' ? 'animate-spin' : ''}`} />
        {config.text}
      </Badge>
      {showConnectButton && !estaConectado && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sync-esp32')}
        >
          <Cpu className="w-4 h-4 mr-2" />
          Conectar ESP32
        </Button>
      )}
    </div>
  );
};
