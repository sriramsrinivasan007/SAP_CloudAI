import React from 'react';
import { SolutionOption, SOLUTIONS } from '../types';

interface SolutionSelectorProps {
  selectedSolution: SolutionOption | null;
  onSelect: (solution: SolutionOption) => void;
  disabled: boolean;
}

export const SolutionSelector: React.FC<SolutionSelectorProps> = ({ selectedSolution, onSelect, disabled }) => {
  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Select Company Solution
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOLUTIONS.map((sol) => (
          <button
            key={sol.id}
            onClick={() => onSelect(sol)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl text-left border-2 transition-all duration-200
              ${selectedSolution?.id === sol.id 
                ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' 
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-bold ${selectedSolution?.id === sol.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {sol.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {sol.description}
                </p>
              </div>
              {selectedSolution?.id === sol.id && (
                <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 ml-2">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};