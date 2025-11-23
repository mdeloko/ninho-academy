import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ESP32HelpAlert = () => {
  const navigate = useNavigate();

  return (
    <Alert className="border-primary/50 bg-primary/5">
      <HelpCircle className="h-5 w-5 text-primary" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold mb-1">ESP32 não aparece na lista?</p>
          <p className="text-sm text-muted-foreground">
            Pode ser que você precise instalar o driver. Veja nosso guia completo de conexão.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/ajuda-esp32')}
          className="flex-shrink-0"
        >
          Ver Guia
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
