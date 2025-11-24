import React from 'react';
import { Lesson, LessonType } from '../../types';

interface PropriedadesNoLicao {
  lesson: Lesson;
  color: string;
  onClick: () => void;
  isNext: boolean;
}

export const LessonNode: React.FC<PropriedadesNoLicao> = ({ lesson, color, onClick, isNext }) => {
  let icone = '★';
  if (lesson.type === LessonType.PRACTICE) icone = '⚡';
  if (lesson.type === LessonType.QUIZ) icone = '?';

  const estilosBloqueado = 'bg-gray-200 border-gray-300 text-gray-400';
  const estilosConcluido = 'bg-brand-green border-brand-darkGreen';
  const estilosAtivo = 'bg-brand-yellow border-brand-darkYellow';

  const estiloFundo = lesson.completed
    ? estilosConcluido
    : lesson.locked
    ? estilosBloqueado
    : estilosAtivo;

  const estiloTexto = lesson.locked ? 'text-gray-400' : 'text-white';

  return (
    <div className="flex flex-col items-center justify-center relative z-10 my-4">
      <button
        onClick={onClick}
        disabled={lesson.locked}
        className={`
          w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
          text-3xl font-black border-b-8 transition-all active:border-b-0 active:translate-y-2
          ${estiloFundo} ${estiloTexto} ${isNext ? 'ring-8 ring-white/50' : ''}
        `}
      >
        {lesson.completed ? '✓' : icone}
      </button>

      {!lesson.locked && (
        <div className="absolute top-full mt-2 bg-white px-3 py-1 rounded-xl border-2 border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-brand-brown whitespace-nowrap">
            {lesson.title}
          </span>
        </div>
      )}
    </div>
  );
};
