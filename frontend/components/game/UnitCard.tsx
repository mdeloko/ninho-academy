import React from 'react';
import { Unit } from '../../types';

interface PropriedadesCartaoUnidade {
  unit: Unit;
}

export const UnitCard: React.FC<PropriedadesCartaoUnidade> = ({ unit }) => {
  return (
    <div
      className={`rounded-2xl p-6 mb-8 text-white ${unit.color} border-b-4 border-black/20 relative overflow-hidden`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-extrabold mb-2">{unit.title}</h2>
          <p className="opacity-90 font-semibold max-w-md">{unit.description}</p>
        </div>
        <button className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
