import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Trophy, ArrowRight, Cpu, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockTheoryModule, mockPracticeModule, mockModules } from '@/data/mockData';
import { toast } from 'sonner';
import { useESP32 } from '@/hooks/useESP32';
import { useAuth } from '@/contexts/AuthContext';

const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status, estaConectado, conectar, desconectar, definirMissao, telemetry } = useESP32();

  const module = mockModules.find((m) => m.id === id);
  const isTheory = module?.type === 'theory';
  const isPractice = module?.type === 'practice';

  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [missionStarted, setMissionStarted] = useState(false);

  if (!module) {
    return <div>Módulo não encontrado</div>;
  }

  const theoryModule = isTheory ? mockTheoryModule : null;
  const practiceModule = !isTheory ? mockPracticeModule : null;

  const handleNextSection = () => {
    if (isTheory && theoryModule) {
      if (currentSection < theoryModule.sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        setShowQuiz(true);
      }
    } else if (practiceModule) {
      if (currentSection < practiceModule.steps.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        handleCompleteModule();
      }
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const question = theoryModule?.quiz[currentQuestion];
    const correct = answerIndex === question?.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!theoryModule) return;
    
    if (currentQuestion < theoryModule.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleCompleteModule();
    }
  };

  const handleCompleteModule = () => {
    setCompleted(true);
    toast.success(`Parabéns! Você ganhou ${module.xpReward} XP! 🎉`, {
      duration: 3000,
    });
    if (isPractice && estaConectado()) {
      desconectar();
    }
  };

  const handleBackToTrail = () => {
    if (isPractice && estaConectado()) {
      desconectar();
    }
    navigate('/trilha');
  };

  const handleConnectESP32 = async () => {
    try {
      await conectar();
      toast.success('ESP32 conectado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao conectar ESP32');
    }
  };

  const handleStartMission = async () => {
    if (!module.firmwareCommand) {
      toast.error('Este módulo não tem missão de firmware configurada');
      return;
    }

    try {
      await definirMissao(module.firmwareCommand);
      setMissionStarted(true);
      toast.success('Missão iniciada no ESP32!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao iniciar missão');
    }
  };

  const progress = isTheory && theoryModule
    ? showQuiz
      ? ((currentQuestion + 1) / theoryModule.quiz.length) * 100
      : ((currentSection + 1) / theoryModule.sections.length) * 100
    : practiceModule
    ? ((currentSection + 1) / practiceModule.steps.length) * 100
    : 0;

  if (completed) {
    return (
      <div className="min-h-screen gradient-success flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center"
        >
          <Card className="p-12 max-w-md">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Trophy className="w-24 h-24 mx-auto mb-6 text-success" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-4">Módulo Concluído!</h1>
            <p className="text-muted-foreground mb-2">
              Você completou: <strong className="text-foreground">{module.title}</strong>
            </p>
            <div className="text-4xl font-bold text-success my-6">
              +{module.xpReward} XP
            </div>
            
            {isTheory && (
              <p className="text-sm text-muted-foreground mb-6">
                Acertos: {score} de {theoryModule?.quiz.length}
              </p>
            )}

            <Button variant="gradient" size="lg" onClick={handleBackToTrail} className="w-full">
              Voltar para Trilha
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBackToTrail}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <h1 className="text-lg font-bold text-center flex-1">{module.title}</h1>
            
            <div className="w-20" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{showQuiz ? 'Quiz' : isTheory ? 'Teoria' : 'Prática'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {isTheory && !showQuiz && theoryModule && (
            <motion.div
              key={`section-${currentSection}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {theoryModule.sections[currentSection].title}
                </h2>
                
                <div className="prose max-w-none mb-8">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {theoryModule.sections[currentSection].content}
                  </p>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleNextSection}
                  className="w-full"
                >
                  {currentSection < theoryModule.sections.length - 1 ? 'Próximo' : 'Ir para Quiz'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {isTheory && showQuiz && theoryModule && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-8">
                <div className="mb-6">
                  <span className="text-sm font-semibold text-primary">
                    Questão {currentQuestion + 1} de {theoryModule.quiz.length}
                  </span>
                  <h2 className="text-2xl font-bold mt-2">
                    {theoryModule.quiz[currentQuestion].question}
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  {theoryModule.quiz[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        selectedAnswer === index
                          ? showResult
                            ? isCorrect
                              ? 'border-success bg-success/10 text-success'
                              : 'border-destructive bg-destructive/10 text-destructive'
                            : 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary hover:bg-accent'
                      }`}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showResult && selectedAnswer === index && (
                          <span>
                            {isCorrect ? (
                              <Check className="w-6 h-6 text-success" />
                            ) : (
                              <X className="w-6 h-6 text-destructive" />
                            )}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 ${
                      isCorrect ? 'bg-success/10 border-2 border-success' : 'bg-destructive/10 border-2 border-destructive'
                    }`}
                  >
                    <p className={`font-semibold mb-2 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                      {isCorrect ? '✅ Correto!' : '❌ Incorreto'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {theoryModule.quiz[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}

                {showResult && (
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={handleNextQuestion}
                    className="w-full"
                  >
                    {currentQuestion < theoryModule.quiz.length - 1 ? 'Próxima Questão' : 'Concluir Módulo'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </Card>
            </motion.div>
          )}

          {!isTheory && practiceModule && (
            <motion.div
              key={`step-${currentSection}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-8">
                <div className="mb-6">
                  <span className="text-sm font-semibold text-secondary">
                    Passo {currentSection + 1} de {practiceModule.steps.length}
                  </span>
                  <h2 className="text-2xl font-bold mt-2">
                    {practiceModule.steps[currentSection].title}
                  </h2>
                </div>

                <p className="text-lg text-muted-foreground mb-6">
                  {practiceModule.steps[currentSection].description}
                </p>

                <Card className="p-6 bg-accent mb-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {practiceModule.steps[currentSection].instruction}
                  </pre>
                </Card>

                {user?.temESP32 && currentSection === practiceModule.steps.length - 1 && (
                  <Card className="p-6 mb-6 border-2 border-primary/20 bg-primary/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      Validação com ESP32
                    </h3>

                    {!estaConectado() ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Conecte seu ESP32 para testar o circuito na prática e validar automaticamente.
                        </p>
                        <Button
                          onClick={handleConnectESP32}
                          disabled={status === 'connecting'}
                          className="w-full"
                        >
                          {status === 'connecting' ? (
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
                    ) : !missionStarted ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-success">
                          <Check className="w-4 h-4" />
                          <span className="font-semibold">ESP32 Conectado</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Clique abaixo para gravar a missão no ESP32 e iniciar o teste.
                        </p>
                        <Button
                          variant="gradient"
                          onClick={handleStartMission}
                          className="w-full"
                        >
                          🚀 Iniciar Missão
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-success mb-2">
                          <Check className="w-4 h-4" />
                          <span className="font-semibold">Missão em Execução</span>
                        </div>

                        <Card className="p-4 bg-black/90 text-green-400 font-mono text-xs">
                          <div className="space-y-1">
                            <div>{'>'} Missão: {module.firmwareCommand}</div>
                            <div>{'>'} Status: {telemetry ? 'Recebendo telemetria...' : 'Aguardando dados...'}</div>
                            {telemetry && (
                              <>
                                <div className="mt-2 pt-2 border-t border-green-900">
                                  <div>LED: {telemetry.readings?.led ? 'ON 🟢' : 'OFF ⚫'}</div>
                                  <div>BTN: {telemetry.readings?.btn ? 'PRESSED 🔴' : 'RELEASED ⚪'}</div>
                                  <div>POT: {telemetry.readings?.pot || 0} / 4095</div>
                                </div>
                              </>
                            )}
                          </div>
                        </Card>

                        <p className="text-sm text-muted-foreground">
                          Observe o comportamento do seu circuito. Quando estiver funcionando corretamente, clique em "Verificar Montagem".
                        </p>
                      </div>
                    )}
                  </Card>
                )}

                <div className="flex gap-3">
                  {currentSection === practiceModule.steps.length - 1 && (
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleNextSection}
                      className="flex-1"
                    >
                      ✓ Verificar Montagem
                    </Button>
                  )}
                  {currentSection < practiceModule.steps.length - 1 && (
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={handleNextSection}
                      className="flex-1"
                    >
                      Próximo Passo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Module;
