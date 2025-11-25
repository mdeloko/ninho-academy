import React, { useState, useEffect } from "react";
import { Lesson } from "../types";
import { Button } from "../components/ui/Button";
import { espService } from "../services/espService";
import { missions, Mission } from "../data/missions";

interface LessonRunnerProps {
  lesson: Lesson;
  user: any;
  onComplete: (xp: number) => Promise<void>;
  onExit: () => void;
}

type Step = "THEORY" | "QUIZ" | "CHOICE" | "PRACTICE" | "SIMULATION" | "COMPLETE";

export const LessonRunner: React.FC<LessonRunnerProps> = ({ lesson, user, onComplete, onExit }) => {
  const [mission, setMission] = useState<Mission | undefined>(undefined);
  const [step, setStep] = useState<Step>("THEORY");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [practiceStatus, setPracticeStatus] = useState<"idle" | "running" | "success">("idle");

  useEffect(() => {
    // Find mission by ID (assuming lesson.id matches mission.id)
    const found = missions.find((m) => m.id === lesson.id);
    if (found) {
      setMission(found);
    } else {
      // Fallback or error
      console.error("Mission not found for lesson", lesson.id);
    }
  }, [lesson.id]);

  useEffect(() => {
    if (step === "PRACTICE") {
      // Verifica se já está conectado
      setIsConnected(espService.isConnected());

      espService.onStatusChange = (status) => {
        setIsConnected(status === "connected");
      };
      espService.onTelemetry = (data) => {
        setTelemetry(data);
      };
    }
    return () => {
      // NÃO desconecta ao sair, apenas limpa os listeners
      espService.onStatusChange = undefined;
      espService.onTelemetry = undefined;
    };
  }, [step]);

  if (!mission) return <div>Carregando missão...</div>;

  const handleQuizCheck = () => {
    const currentQuiz = mission.quizzes[quizIndex];
    if (selectedOption === currentQuiz.correctIndex) {
      setQuizStatus("correct");
      new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3").play().catch(() => {});
    } else {
      setQuizStatus("wrong");
      new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.ogg").play().catch(() => {});
    }
  };

  const handleQuizNext = () => {
    if (quizIndex < mission.quizzes.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuizStatus("idle");
    } else {
      setStep("CHOICE");
    }
  };

  const handleConnect = async () => {
    await espService.conectar();
  };

  const handleStartPractice = async () => {
    if (!isConnected) return;
    await espService.enviarComando("SET_MISSION", { missionId: mission.practice.firmwareCommand });
    setPracticeStatus("running");
  };

  const handleFinish = async (xp?: number) => {
    await onComplete(xp || lesson.xpReward || 50);
  };

  const renderTheory = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-brand-brown">{mission.theory.title}</h1>
      {mission.theory.content.map((p, i) => (
        <p
          key={i}
          className="text-lg text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm text-red-500">$1</code>') }}
        />
      ))}
      {mission.theory.codeSnippet && <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto font-mono text-sm">{mission.theory.codeSnippet}</pre>}
      <Button fullWidth size="lg" onClick={() => setStep("QUIZ")}>
        Entendi, vamos para os exercícios!
      </Button>
    </div>
  );

  const renderQuiz = () => {
    const q = mission.quizzes[quizIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between text-sm font-bold text-gray-400 uppercase">
          <span>
            Exercício {quizIndex + 1} de {mission.quizzes.length}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-brand-brown">{q.question}</h2>
        {q.codeSnippet && <pre className="bg-gray-100 p-4 rounded-xl font-mono text-sm border-2 border-gray-200">{q.codeSnippet}</pre>}
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => quizStatus !== "correct" && setSelectedOption(i)}
              className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all ${
                selectedOption === i
                  ? quizStatus === "correct"
                    ? "bg-green-100 border-green-500 text-green-800"
                    : quizStatus === "wrong"
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-blue-50 border-blue-400 text-blue-800"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {quizStatus === "wrong" && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold border border-red-100">❌ {q.feedback}</div>}
        {quizStatus === "correct" && <div className="bg-green-50 text-green-600 p-4 rounded-xl font-bold border border-green-100">✅ {q.feedback}</div>}

        <div className="pt-4">
          {quizStatus === "idle" || quizStatus === "wrong" ? (
            <Button fullWidth size="lg" onClick={handleQuizCheck} disabled={selectedOption === null}>
              Verificar
            </Button>
          ) : (
            <Button fullWidth size="lg" variant="success" onClick={handleQuizNext}>
              Continuar
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderChoice = () => {
    // Se é lição teórica (prática vazia), pula direto para simulação/conclusão
    const isTheoreticalOnly = !mission.practice.checklist || mission.practice.checklist.length === 0;

    if (isTheoreticalOnly) {
      return (
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-extrabold text-brand-brown">Parabéns! 🎉</h2>
          <p className="text-lg text-gray-600">{mission.simulation.content}</p>
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
            <p className="text-sm text-blue-700 font-bold">Você completou a lição teórica! Próximas missões terão desafios práticos.</p>
          </div>
          <Button fullWidth size="lg" onClick={() => handleFinish()}>
            Concluir Lição
          </Button>
        </div>
      );
    }

    // Lição com prática - mostra as opções usuais
    return (
      <div className="max-w-xl mx-auto text-center space-y-8">
        <h2 className="text-3xl font-extrabold text-brand-brown">Quer tentar na prática?</h2>
        <p className="text-lg text-gray-600">Você tem um ESP32 e os componentes necessários para montar este circuito agora?</p>
        <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-100 text-left space-y-2">
          <div className="font-bold text-brand-brown mb-2">Checklist:</div>
          {mission.practice.checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>✅</span> <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Button fullWidth size="lg" onClick={() => setStep("PRACTICE")}>
            Sim, tenho o kit! (Modo Prático)
          </Button>
          <Button fullWidth variant="secondary" onClick={() => setStep("SIMULATION")}>
            Não tenho agora (Modo Simulação)
          </Button>
        </div>
      </div>
    );
  };

  const renderPractice = () => (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <h2 className="text-2xl font-extrabold text-brand-brown">{mission.practice.title}</h2>
      <p className="text-gray-600">{mission.practice.description}</p>

      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm text-left">
        <h3 className="font-bold mb-4">Instruções:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          {mission.practice.checklist.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {!isConnected ? (
        <div className="py-8">
          <Button size="lg" onClick={handleConnect}>
            📡 Conectar ESP32
          </Button>
          <p className="text-xs text-gray-400 mt-2">Certifique-se que o ESP32 está plugado via USB.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 text-green-700 p-3 rounded-lg font-bold inline-block">● Conectado</div>

          {practiceStatus === "idle" ? (
            <Button fullWidth size="lg" onClick={handleStartPractice}>
              🚀 Gravar no ESP32 (Iniciar Missão)
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-left text-xs h-48 overflow-y-auto">
                <div>
                  {">"} Iniciando missão {mission.practice.id}...
                </div>
                {telemetry && (
                  <>
                    <div>{">"} Telemetria recebida:</div>
                    <div> LED: {telemetry.readings?.led ? "ON" : "OFF"}</div>
                    <div> BTN: {telemetry.readings?.btn ? "PRESSED" : "RELEASED"}</div>
                    <div> POT: {telemetry.readings?.pot}</div>
                  </>
                )}
              </div>
              <p className="text-sm font-bold text-brand-brown">Observe seu ESP32! O comportamento deve estar conforme a teoria.</p>
              <Button fullWidth variant="success" onClick={() => handleFinish()}>
                Funcionou! Concluir Missão
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSimulation = () => (
    <div className="max-w-xl mx-auto text-center space-y-8">
      <h2 className="text-3xl font-extrabold text-brand-brown">{mission.simulation.title}</h2>
      <div className="bg-blue-50 p-8 rounded-3xl border-4 border-blue-100">
        <div className="text-6xl mb-4">🤔</div>
        <p className="text-lg font-bold text-blue-900">{mission.simulation.content}</p>
      </div>
      <Button fullWidth size="lg" onClick={() => handleFinish()}>
        Concluir Missão
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={onExit} className="text-gray-400 hover:text-brand-brown font-bold">
          ✕ Sair
        </button>
        <div className="font-bold text-brand-brown opacity-50">
          {step === "THEORY" && "Teoria"}
          {step === "QUIZ" && "Quiz"}
          {step === "PRACTICE" && "Prática"}
          {step === "SIMULATION" && "Simulação"}
        </div>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        {step === "THEORY" && renderTheory()}
        {step === "QUIZ" && renderQuiz()}
        {step === "CHOICE" && renderChoice()}
        {step === "PRACTICE" && renderPractice()}
        {step === "SIMULATION" && renderSimulation()}
      </div>
    </div>
  );
};
