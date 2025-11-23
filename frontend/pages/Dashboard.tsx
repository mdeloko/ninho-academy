import React, { useEffect, useState } from "react";
import { UnitCard } from "../components/game/UnitCard";
import { LessonNode } from "../components/game/LessonNode";
import { Lesson, Track, User, LessonType } from "../types";
import { missions } from "../data/missions";

interface DashboardProps {
  user: User;
  onLessonSelect: (lesson: Lesson) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLessonSelect }) => {
  const [trilha, setTrilha] = useState<Track | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Map missions to Track structure
    const mappedLessons: Lesson[] = missions.map((m, index) => {
      // Determine if locked based on previous lesson completion
      // First lesson is always unlocked.
      // Subsequent lessons are locked if the previous one is not in licoesConcluidas.
      const previousMissionId = index > 0 ? missions[index - 1].id : null;

      // PARA TESTES: Desbloqueando todas as missões temporariamente
      // const isLocked = previousMissionId
      //   ? !user.licoesConcluidas.includes(previousMissionId)
      //   : false;
      const isLocked = false;

      return {
        id: m.id,
        unitId: "UNIT_1",
        title: m.title,
        type: LessonType.PRATICA,
        description: m.description,
        questions: [], // Not used by new runner
        xpReward: m.xp,
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
  }, [user.licoesConcluidas]);

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
