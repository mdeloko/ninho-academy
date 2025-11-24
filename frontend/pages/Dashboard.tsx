import React, { useEffect, useState } from "react";
import { UnitCard } from "../components/game/UnitCard";
import { LessonNode } from "../components/game/LessonNode";
import { Lesson, Track, User, LessonType } from "../types";
import { missions } from "../data/missions";

interface DashboardProps {
  user: User;
  currentLevel: number;
  onLessonSelect: (lesson: Lesson) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, currentLevel, onLessonSelect }) => {
  const [trilha, setTrilha] = useState<Track | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Map missions to Track structure
    const mappedLessons: Lesson[] = missions.map((m, index) => {
      // Level = número de missões completadas
      // Pode fazer a missão se seu level >= index (0-indexed)
      const isLocked = currentLevel < index;

      return {
        id: m.id,
        unitId: "UNIT_1",
        title: m.title,
        type: LessonType.PRATICA,
        description: m.description,
        questions: [], // Not used by new runner
        xpReward: 50, // XP padrão por missão
        requiresKit: true,
        completed: user.licoesConcluidas.includes(m.id),
        locked: isLocked,
      };
    });

    const track: Track = {
      id: "TRACK_IOT",
      title: "Fundamentos de IoT",
      description: "Aprenda eletrônica e programação com ESP32",
      units: [
        {
          id: "UNIT_1",
          title: "Introdução ao Hardware",
          description: "Seus primeiros passos com componentes eletrônicos",
          color: "bg-brand-green",
          lessons: mappedLessons,
        },
      ],
    };

    setTrilha(track);
    setCarregando(false);
  }, [user.licoesConcluidas, currentLevel]);

  if (carregando) {
    return <div className="p-10 text-center font-bold text-brand-brown animate-pulse">Carregando mapa...</div>;
  }

  if (!trilha) {
    return <div className="p-10 text-center text-red-500">Erro ao carregar trilha.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-8 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-extrabold text-brand-brown opacity-50 uppercase tracking-widest">{trilha.title}</h1>
      </div>

      {trilha.units.map((unidade) => (
        <div key={unidade.id}>
          <UnitCard unit={unidade} />

          <div className="flex flex-col items-center space-y-4 mb-12">
            {unidade.lessons.map((licao, indice) => {
              const deslocamento = indice % 2 === 0 ? "translate-x-0" : indice % 4 === 1 ? "translate-x-12" : "-translate-x-12";

              return (
                <div key={licao.id} className={`transform ${deslocamento}`}>
                  <LessonNode lesson={licao} color={unidade.color} isNext={!licao.completed && !licao.locked} onClick={() => onLessonSelect(licao)} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
