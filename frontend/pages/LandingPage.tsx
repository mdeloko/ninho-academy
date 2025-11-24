import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
// Definição centralizada do nome da aplicação para evitar repetição e facilitar futura mudança.
const APP_NAME: string = (import.meta as any).env?.VITE_APP_NAME || "Ninho Academy";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [typingText, setTypingText] = useState("");
  const fullText = "Codando...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypingText(fullText.slice(0, index));
        index++;
      } else {
        setTimeout(() => {
          index = 0;
        }, 2000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const journeyProgress = 0.68; // valor demonstrativo
  const gamificationNodes = [
    {
      icon: "🏆",
      label: "Início",
      circleClasses: "w-16 h-16 bg-brand-green border-b-4 border-brand-darkGreen text-white text-3xl",
      labelClasses: "font-bold text-sm text-brand-brown",
    },
    {
      icon: "⭐",
      label: "Pontos",
      circleClasses: "w-14 h-14 bg-white border-b-4 border-gray-200 text-brand-brown text-2xl",
      labelClasses: "font-bold text-sm text-brand-brown",
    },
    {
      icon: "⚡",
      label: "Desafio",
      circleClasses: "w-16 h-16 bg-brand-yellow border-b-4 border-brand-darkYellow text-brand-brown text-3xl",
      labelClasses: "font-bold text-sm text-brand-brown",
    },
    {
      icon: "🏅",
      label: "Final",
      circleClasses: "w-16 h-16 bg-white border-4 border-gray-300 border-b-gray-400 text-brand-brown text-3xl",
      labelClasses: "font-bold text-sm text-gray-400",
      muted: true,
    },
  ];
  return (
    <div className="bg-brand-beige min-h-screen text-brand-brown font-sans selection:bg-brand-yellow selection:text-brand-brown">
      <style>{`
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-8px) rotate(-3deg); }
          75% { transform: translateX(8px) rotate(3deg); }
        }
      `}</style>
      {/* Header / Nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border-2 border-brand-brown object-cover" />
          <span className="font-extrabold text-xl">{APP_NAME}</span>
        </div>
        <Button size="sm" onClick={onStart}>
          Entrar
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20 space-y-24">
        {/* HERO SECTION */}
        <section className="bg-brand-yellow rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-xl border-b-8 border-brand-darkYellow">
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-block bg-brand-brown text-brand-yellow px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">Versão Beta</div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-brand-brown">
              Aprenda e explore tecnologia. <span className="text-white drop-shadow-md">No seu ritmo!</span>
            </h1>
            <p className="text-lg md:text-xl font-bold opacity-80 max-w-lg">Monte circuitos, programe o ESP32 e aprenda eletrônica na prática.</p>
            <div className="pt-4">
              <button
                onClick={onStart}
                className="bg-brand-brown text-brand-yellow text-xl px-8 py-4 rounded-2xl font-black border-b-4 border-black hover:-translate-y-1 transition-transform shadow-lg"
              >
                Começar agora
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center z-10">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white/20 rounded-full flex items-center justify-center border-4 border-brand-brown/10 backdrop-blur-sm relative p-8">
              <img
                src="/assets/logo.png"
                alt="Ninho Academy"
                className="w-full h-full object-contain"
                style={{
                  animation: "sway 3s ease-in-out infinite",
                }}
              />
              <div className="absolute -bottom-4 bg-white px-6 py-2 rounded-xl border-2 border-brand-brown font-bold rotate-3 transform shadow-lg text-sm min-w-[120px]">
                {typingText}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>

          {/* Background Decorative Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 text-9xl">⚡</div>
            <div className="absolute bottom-10 left-10 text-9xl">🔧</div>
          </div>
        </section>

        {/* SECTION: O que é essa plataforma? */}
        <section className="text-center space-y-12">
          <h2 className="text-3xl font-extrabold">O que é essa plataforma?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🔌", title: "Eletrônica Básica", desc: "Aprenda peças e circuitos passo a passo." },
              { icon: "💻", title: "Código no ESP32", desc: "Escreva e envie programas simples para o ESP32." },
              { icon: "🗺️", title: "Trilhas Passo a Passo", desc: "Siga aulas e desafios do fácil ao avançado." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 p-6 hover:bg-white hover:rounded-3xl hover:shadow-sm transition-all duration-300">
                <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center text-4xl border-b-4 border-brand-yellow">{item.icon}</div>
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="opacity-70 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Como funciona na prática */}
        <section className="bg-brand-light rounded-3xl p-10 border-2 border-brand-brown/5">
          <h2 className="text-3xl font-extrabold text-center mb-16">Como funciona na prática</h2>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-brand-brown/10 -z-0 transform -translate-y-1/2 border-t-2 border-dashed border-brand-brown/30"></div>

            {[
              { icon: "👤", title: "Entre na Plataforma" },
              { icon: "🎯", title: "Escolha seu Módulo" },
              { icon: "📖", title: "Explicações e Guias" },
              { icon: "🔌", title: "Conecte seu ESP32" },
              { icon: "🛠️", title: "Monte o Circuito Físico" },
              { icon: "📈", title: "Acompanhe seu Progresso" },
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-white p-4 rounded-2xl border-2 border-brand-brown/10 w-32 md:w-40 flex flex-col items-center gap-3 shadow-sm text-center">
                <div className="text-3xl bg-brand-yellow/20 p-2 rounded-lg">{step.icon}</div>
                <span className="font-bold text-xs md:text-sm leading-tight">{step.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: O que dá para aprender */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">O que dá para aprender</h2>
            <p className="opacity-70">Aprenda desde o piscar de um LED até criar sistemas conectados. Tudo integrado diretamente com o ESP32.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Circuitos e Pinos", desc: "Controle entradas e saídas." },
              { icon: "💡", title: "LEDs e Botões", desc: "Interação básica com hardware." },
              { icon: "📡", title: "Sensores Diversos", desc: "Temperatura, distância e mais." },
              { icon: "🎚️", title: "PWM e Controle", desc: "Controle de potência e brilho." },
            ].map((item, i) => (
              <div key={i} className="bg-brand-yellow/10 p-6 rounded-2xl border-2 border-brand-yellow/20 flex flex-col items-center text-center gap-3">
                <span className="text-4xl mb-2">{item.icon}</span>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs opacity-70">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-100 flex items-center gap-6">
              <span className="text-5xl">🔄</span>
              <div>
                <h4 className="font-bold text-lg text-sky-900">Algoritmos e Lógica</h4>
                <p className="text-sm text-sky-700">Lógica de programação aplicada ao mundo real.</p>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-100 flex items-center gap-6">
              <span className="text-5xl">🚦</span>
              <div>
                <h4 className="font-bold text-lg text-purple-900">Máquina de Estados</h4>
                <p className="text-sm text-purple-700">Controle o fluxo e comportamento dos seus projetos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Feedback e Erros */}
        <section className="bg-brand-beige py-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-extrabold">
              Aprenda com erros.
              <br />
              Feedback instantâneo.
            </h2>
            <p className="opacity-70 text-lg">
              Acabou a frustração de "não funciona e não sei porquê". Receba feedback claro e dicas personalizadas quando seu circuito não se comportar como esperado.
            </p>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm">⚠️ Erros de Sintaxe</span>
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold text-sm">🔌 Erros de Conexão</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border-4 border-gray-700 relative transform rotate-2 hover:rotate-0 transition-transform">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-sm space-y-2">
                <div className="text-gray-400">1 void setup() {"{"}</div>
                <div className="text-gray-400">2 pinMode(LED, OUTPUT);</div>
                <div className="text-gray-400">3 {"}"}</div>
                <div className="text-gray-400">4 </div>
                <div className="bg-red-500/20 text-red-300 p-2 rounded border-l-4 border-red-500">! Erro: O pino 12 não está conectado.</div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="bg-brand-yellow text-brand-brown px-4 py-1 rounded font-bold text-sm">Corrigir</button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Gamificação */}
        <section className="text-center space-y-12">
          <h2 className="text-3xl font-extrabold">Gamificação e Progresso</h2>
          <div className="inline-block bg-brand-yellow px-6 py-2 rounded-full font-black text-brand-brown mb-8 shadow-sm border-2 border-brand-brown/10">Jornada de Aprendizado</div>

          <div className="relative max-w-3xl mx-auto px-8 py-12">
            <div
              className="absolute inset-x-12 top-1/2 h-4 rounded-full border border-brand-brown/10 bg-white shadow-inner -translate-y-1/2"
              style={{
                background: `linear-gradient(90deg, #c38127 0%, #f0b646 ${journeyProgress * 100}%, #ffffff ${journeyProgress * 100}%)`,
              }}
            ></div>
            <div className="relative flex justify-between items-center z-10">
              {gamificationNodes.map((node) => (
                <div key={node.label} className="flex flex-col items-center gap-2 text-center">
                  <div className={`rounded-full flex items-center justify-center shadow-lg ${node.circleClasses} ${node.muted ? "opacity-70 grayscale" : ""}`}>{node.icon}</div>
                  <span className={node.labelClasses}>{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: Público e Origem */}
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl border-b-8 border-gray-100">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold">Para quem é?</h2>
            <p className="text-sm opacity-70 max-w-md">Serve para qualquer pessoa curiosa que quer aprender ou ensinar eletrônica e programação de forma simples e prática.</p>
            <ul className="space-y-4">
              {["Quem está começando", "Quem quer ensinar", "Turmas e grupos", "Projetos da escola", "Curiosos em tecnologia"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold opacity-80">
                  <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t-2 border-gray-100">
              <h3 className="text-xl font-extrabold mb-4">Por que existe?</h3>
              <p className="text-sm opacity-60 mb-4">
                Projeto desenvolvido na Disciplina Certificadora da Competência 2, focado em atender alunos e interessados no projeto de extensão Ninho de Pardais.
              </p>
              <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="h-10 w-24 bg-gray-200 rounded flex items-center justify-center font-bold text-xs">UTFPR</div>
                <div className="h-10 w-24 bg-gray-200 rounded flex items-center justify-center font-bold text-xs">Aprender</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-center">
            <div className="bg-yellow-50 rounded-2xl p-8 border-2 border-yellow-100">
              <img src="/assets/teaching.png" className="rounded-xl w-full object-cover" alt="Sala de aula" />
            </div>
          </div>
        </div>

        {/* SECTION: FAQ */}
        <section className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-extrabold text-center">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Preciso de kit físico?", a: "Para as lições práticas sim, mas você pode fazer a trilha teórica sem ele!" },
              { q: "Como acesso?", a: "Basta criar uma conta gratuitamente." },
              { q: "Quais navegadores?", a: "Google Chrome ou Edge (suporte a Web Serial API)." },
              { q: "É gratuito?", a: "Sim! O projeto é open source e educativo." },
            ].map((faq, i) => (
              <React.Fragment key={i}>
                <FaqItem question={faq.q} answer={faq.a} />
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-brand-yellow py-16 px-6 text-brand-brown">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-extrabold">Pronto para voar?</h2>
          <div className="flex justify-center">
            <Button size="lg" variant="secondary" onClick={onStart} className="mx-auto">
              Acessar a Plataforma Agora
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left text-sm pt-12 border-t-2 border-brand-brown/10 mt-12">
            <div>
              <div className="font-bold mb-4">Social Media</div>
              <div className="flex gap-2 text-2xl">
                <span>📷</span> <span>📘</span> <span>🎥</span>
              </div>
            </div>
            <div>
              <div className="font-bold mb-4">{APP_NAME}</div>
              <p className="opacity-70">Plataforma educacional de eletrônica e programação.</p>
            </div>
          </div>
          <div className="text-xs opacity-50 pt-8">© 2025 {APP_NAME}. Plataforma Educacional Open Source.</div>
        </div>
      </footer>
    </div>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-4 text-left font-bold hover:bg-gray-50">
        {question}
        <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && <div className="p-4 pt-0 text-gray-600 text-sm">{answer}</div>}
    </div>
  );
};
export default LandingPage;
