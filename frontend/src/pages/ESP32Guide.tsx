import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Chrome, Cable, Download, AlertCircle, CheckCircle, Cpu, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ESP32Guide = () => {
  const navigate = useNavigate();

  const drivers = [
    {
      name: 'CP2102 / CP2104',
      brand: 'Silicon Labs',
      url: 'https://www.silabs.com/software-and-tools/usb-to-uart-bridge-vcp-drivers',
      description: 'Chip USB-Serial mais comum em placas ESP32',
    },
    {
      name: 'CH340 / CH341',
      brand: 'WCH',
      url: 'https://www.wch-ic.com/downloads/ch341ser_exe.html',
      description: 'Muito usado em placas mais baratas',
    },
    {
      name: 'CH9102 / CH9102F',
      brand: 'WCH (placas novas)',
      url: 'https://learn.adafruit.com/how-to-install-drivers-for-wch-usb-to-serial-chips-ch9102f-ch9102/overview',
      description: 'Versão mais recente do chip WCH',
    },
    {
      name: 'FT232 / FTDI',
      brand: 'FTDI',
      url: 'https://ftdichip.com/drivers/vcp-drivers/',
      description: 'Chip de alta qualidade usado em algumas placas',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Guia de Conexão ESP32
            </h1>
            <p className="text-muted-foreground">
              Siga este passo a passo para conectar seu ESP32 ao navegador
            </p>
          </div>

          {/* Step 1 - Antes de Começar */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Antes de Começar
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Chrome className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Use Google Chrome ou Microsoft Edge</p>
                      <p className="text-sm text-muted-foreground">
                        Outros navegadores não suportam conexão USB direta
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cable className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Use um cabo USB com DADOS</p>
                      <p className="text-sm text-muted-foreground">
                        Muitos cabos só carregam energia! Teste outro cabo se não funcionar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Conecte o ESP32 na USB do computador</p>
                      <p className="text-sm text-muted-foreground">
                        Evite usar hubs USB, conecte direto no PC
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2 - Conectar */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3">
                  Clique em "Conectar"
                </h2>
                <div className="space-y-3">
                  <p>Clique no botão <strong>Conectar</strong> e uma janela vai abrir mostrando as portas disponíveis.</p>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Se aparecer uma porta</strong> (ex: COM3, USB Serial, SLAB_USBtoUART, wchusbserial),
                      selecione ela e pronto! 🎉
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3 - Problema: Nenhuma Porta */}
          <Card className="p-6 border-warning">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3 text-warning">
                  Não Apareceu Nenhuma Porta?
                </h2>
                <p className="mb-4">
                  Isso geralmente significa que <strong>falta o driver</strong> do chip USB-Serial da sua placa.
                  Não se preocupe, é fácil resolver!
                </p>

                <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Como identificar o chip da sua placa:
                  </h3>
                  <p className="text-sm mb-3">
                    Olhe o chip pequeno perto da entrada USB do ESP32.
                    Geralmente está escrito nele um destes nomes:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-background rounded p-2">
                      <strong>CP2102</strong> ou <strong>CP2104</strong>
                    </div>
                    <div className="bg-background rounded p-2">
                      <strong>CH340</strong> ou <strong>CH341</strong>
                    </div>
                    <div className="bg-background rounded p-2">
                      <strong>CH9102</strong> ou <strong>CH9102F</strong>
                    </div>
                    <div className="bg-background rounded p-2">
                      <strong>FT232</strong> ou <strong>FTDI</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 4 - Drivers */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Baixe e Instale o Driver
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Escolha <strong>apenas o driver do chip que sua placa usa</strong>:
                </p>

                <div className="space-y-3">
                  {drivers.map((driver) => (
                    <div
                      key={driver.name}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{driver.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{driver.brand}</p>
                          <p className="text-sm">{driver.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(driver.url, '_blank')}
                          className="flex-shrink-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="mt-4">
                  <AlertDescription>
                    <strong>Linux:</strong> Geralmente já vem com os drivers instalados, você não precisa instalar nada!
                  </AlertDescription>
                </Alert>

                <div className="mt-4 p-4 bg-accent rounded-lg">
                  <p className="font-semibold mb-2">Depois de instalar o driver:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Desconecte e conecte o ESP32 novamente</li>
                    <li>Volte à página anterior</li>
                    <li>Tente conectar novamente</li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="usb-nativo">
                <AccordionTrigger>
                  E se minha placa tiver USB nativo?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Algumas placas mais novas (ESP32-S2, ESP32-S3, ESP32-C3/C6) têm USB nativo e
                    aparecem direto como <strong>USB CDC</strong> ou <strong>USB Serial/JTAG</strong>.
                  </p>
                  <p>
                    Nesse caso, você não precisa instalar driver! A porta já deve aparecer automaticamente.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ainda-nao-funciona">
                <AccordionTrigger>
                  Instalei o driver mas ainda não funciona
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Tente estas soluções:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Troque o cabo USB</strong> - muitos cabos só carregam</li>
                    <li><strong>Tente outra porta USB</strong> do computador</li>
                    <li><strong>Feche outros programas</strong> como Arduino IDE ou Serial Monitor</li>
                    <li><strong>Reinicie o computador</strong> após instalar o driver</li>
                    <li>No Windows, vá no Gerenciador de Dispositivos e veja se aparece como "Dispositivo desconhecido"</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mac">
                <AccordionTrigger>
                  Como instalar no macOS?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    No macOS, você precisa permitir a instalação do driver nas Preferências do Sistema:
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Baixe e execute o instalador do driver</li>
                    <li>Abra <strong>Preferências do Sistema → Segurança e Privacidade</strong></li>
                    <li>Clique em <strong>Permitir</strong> para o driver que você instalou</li>
                    <li>Reinicie o computador</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Action Button */}
          <div className="text-center pt-4">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate(-1)}
              className="shadow-lg"
            >
              Voltar e Tentar Conectar
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ESP32Guide;
